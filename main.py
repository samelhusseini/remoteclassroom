import os
import cgi
import uuid
from google.appengine.ext import ndb
from flask import Flask, render_template, redirect, session, request, make_response, url_for
from datetime import datetime, timedelta
import json
import logging

from common import app, p, getStudents, getMeetings, getStudent, pusher_key_config
from model import Log, Student, Course

from hashids import Hashids
from counter import increment, get_count

from common import feedUpdated, configChanged, generate_color, generate_user_id
import admin
import lti

from opentok import OpenTok, MediaModes

from pylti.common import LTI_SESSION_KEY

import settings

from canvas_read import CanvasReader

DEFAULT_COURSE_PREFIX = 'remoteclassschool'
OPENTOK_API_KEY = '46055162'
OPENTOK_API_SECRET = '29da2d1de1fdb09d35bf8a8b30167604e97f67f5'

'''
@app.route("/class")
def show_class():
    link = Link.get_by_id('class_link')
    if link == None:
        return redirect("/")
    return redirect(link.link)

@app.route("/classroom")
def show_classroom():
    link = Link.get_by_id('class_link')
    if link == None:
        return redirect("/")
    return redirect(link.link + "?sl=")

@app.route("/slide")
def show_slide():
    link = Link.get_by_id('slide_link')
    return redirect(link.link)

@app.route("/quiz")
def show_quiz():
    quizLink = app.config.get('features')['quiz']['redirectLink']
    return redirect(quizLink)

@app.route("/changeclassroom")
def show_admin_change_classlink():
    link = Link.get_by_id('class_link')
    jsonconfig = json.dumps(app.config.get('config'))
    return render_template('admin/classroom_link.html', jsconfig=jsonconfig, classlink=link)

@app.route("/changeslide")
def show_admin_change_slidelink():
    link = Link.get_by_id('slide_link')
    jsonconfig = json.dumps(app.config.get('config'))
    return render_template('admin/slide_link.html',  jsconfig=jsonconfig, slidelink=link)

def go_to_student(studentId):
    student = getStudent(studentId)
    if student is not None:
        return redirect(student['skypeMeeting'])
    return redirect("/")

@app.route("/changeclassroom", methods=['POST'])
def trigger_changeclassroom():
    classlink =  cgi.escape(request.form['classlink'])
    link = Link.get_or_insert('class_link', link=classlink)
    link.link = classlink
    link.put()

    return redirect("/changeclassroom")

@app.route("/changeslide", methods=['POST'])
def trigger_changeslide():
    slidelink =  cgi.escape(request.form['slidelink'])

    link = Link.get_or_insert('slide_link', link=slidelink)
    link.link = slidelink
    link.put()

    return redirect("/changeslide")
'''

@app.route("/")
def show_index():
    return render_template('www/index.html')

@app.route("/test")
def show_test():
    return render_template('test.html')


@app.route("/main")
def main():
    return render_template('main.html')

@app.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        content = request.get_json(silent=True)
        fullName = cgi.escape(content['username'])
        className = cgi.escape(content['classname'])

        hashids = Hashids(salt=settings.HASHID_SALT,min_length=6)
        increment()
        count = get_count()
        hashid = hashids.encode(count)

        courseId = DEFAULT_COURSE_PREFIX + hashid
        userId = request.cookies.get('remote_userid') if 'remote_userid' in request.cookies else generate_user_id()
        userColor = request.cookies.get('remote_usercolor') if 'remote_usercolor' in request.cookies else generate_color()

        host = app.config.get('host')
        resp = make_response(hashid)

        # Add course to database
        key = courseId
        course = Course.get_or_insert(key, courseId=courseId)
        course.put()

        # Add teacher to course

        # Create OpenTok session
        opentok_sdk = OpenTok(OPENTOK_API_KEY, OPENTOK_API_SECRET)
        # use tokbox server to route media streams;
        # if you want to use p2p - change media_mode to MediaModes.relayed
        opentok_session = opentok_sdk.create_session(media_mode = MediaModes.routed)
        opentok_token = opentok_sdk.generate_token(opentok_session.session_id)
        
        key = courseId + userId
        user = Student.get_or_insert(key, 
            courseId = courseId,
            studentId = userId,
            fullName = fullName,
            color = userColor,
            role = 'TEACHER',
            opentokSessionId = opentok_session.session_id,
            opentokToken = opentok_token
        )
        user.put()

        # Set user cookies (teacher role)
        auth = json.loads(request.cookies.get('remote_auth')) if 'remote_auth' in request.cookies else {}
        auth[hashid] = {
            'role': 'Instructor',
            'opentok_api_key': OPENTOK_API_KEY,
            'opentok_session_id': user.opentokSessionId,
            'opentok_token': user.opentokToken
        }
        resp.set_cookie('remote_userfullname', fullName)
        resp.set_cookie('remote_auth', json.dumps(auth))
        resp.set_cookie('remote_userid', userId)
        resp.set_cookie('remote_usercolor', userColor)
        #resp.set_cookie('remote_userinitials', userInitials)

        return resp
    return redirect('/main#/create')


@app.route('/join', methods=['POST'])
def join():
    content = request.get_json(silent=True)
    hashid = cgi.escape(content['hashid'])
    fullName = cgi.escape(content['username'])
    userId = request.cookies.get('remote_userid') if 'remote_userid' in request.cookies else generate_user_id()
    userColor = request.cookies.get('remote_usercolor') if 'remote_usercolor' in request.cookies else generate_color()

    resp = make_response(hashid)

    # Ensure course exists
    courseId = DEFAULT_COURSE_PREFIX + hashid
    course = ndb.Key('Course', courseId).get()

    # Add user to course
    key = courseId + userId
    user = Student.get_or_insert(key, courseId=courseId, studentId=userId, fullName=fullName, color=userColor)
    userInitials = user.initials
    user.put()

    if not user.opentokSessionId:
        opentok_sdk = OpenTok(OPENTOK_API_KEY, OPENTOK_API_SECRET)
        # use tokbox server to route media streams;
        # if you want to use p2p - change media_mode to MediaModes.relayed
        opentok_session = opentok_sdk.create_session(media_mode = MediaModes.routed)
        opentok_token = opentok_sdk.generate_token(opentok_session.session_id)

        user.opentokSessionId = opentok_session.session_id
        user.opentokToken = opentok_token
        user.put()

    teacher = Student.get_teacher_by_course(courseId)

    # Set user cookies (student role)
    auth = json.loads(request.cookies.get('remote_auth')) if 'remote_auth' in request.cookies else {}
    auth[hashid] = {
        'role': 'Student',
        'opentok_api_key': OPENTOK_API_KEY,
        'opentok_session_id': user.opentokSessionId,
        'teacher_session_id': teacher.opentokSessionId,
        'opentok_token': user.opentokToken
    }
    resp.set_cookie('remote_userfullname', fullName)
    resp.set_cookie('remote_auth', json.dumps(auth))
    resp.set_cookie('remote_userid', userId)
    resp.set_cookie('remote_usercolor', userColor)
    resp.set_cookie('remote_userinitials', userInitials)

    configChanged(courseId, 'config', 'users')
    return resp

@app.route("/<launch_id>")
def launch_by_id(launch_id):
    #session['course_id'] = launch_id
    #classSkype = ndb.Key('Setting', session['course_id'] + 'classSkype').get()
    #iframeUrl = ndb.Key('Setting', session['course_id'] + 'iframeUrl').get()
    jsonconfig = {
        'PUSHER_APP_KEY': json.dumps(pusher_key_config['PUSHER_APP_KEY']).replace('"', ''),
        #'iframeUrl': json.dumps(iframeUrl.value).replace('"', '') if iframeUrl else '',
        #'classSkype': json.dumps(classSkype.value).replace('"', '') if classSkype else ''
    }

    # Lookup course id
    courseId = DEFAULT_COURSE_PREFIX + launch_id
    course = ndb.Key('Course', courseId).get()

    if not course:
        return "Error: No such course code"

    if 'remote_auth' not in request.cookies:
        return redirect('/main?launch=' + launch_id + '#join')
        
    auth = json.loads(request.cookies.get('remote_auth'))
    userId = request.cookies.get('remote_userid')
    userColor = request.cookies.get('remote_usercolor')
    fullName = request.cookies.get('remote_userfullname')
    userInitials = request.cookies.get('remote_userinitials')
    role = auth[launch_id]['role'] if launch_id in auth else ''
    host = os.environ['HTTP_HOST']
    opentok_session_id = auth[launch_id]['opentok_session_id'] if launch_id in auth else ''
    opentok_token = auth[launch_id]['opentok_token'] if launch_id in auth else ''

    if not role:
        return redirect('/main?launch='+launch_id+'#join')
    
    session['opentok_session_id'] = opentok_session_id

    # Setup fake LTI session
    session['full_name'] = fullName
    session['guid'] = str(uuid.uuid4()) # Generate new UUID
    session['course_id'] = courseId
    session['user_id'] = userId
    session['user_color'] = userColor
    session['user_initials'] = userInitials
    session['host'] = host
    #session['user_image'] = request.form.get('user_image')

    session[LTI_SESSION_KEY] = True
    session['oauth_consumer_key'] = settings.CONSUMER_KEY

    jsonsession = {
        #'guid': session['guid'],
        'course_id': DEFAULT_COURSE_PREFIX + launch_id,
        'user_id': userId, #session['user_id'],
        'full_name': fullName,
        'user_color': userColor,
        'user_initials': userInitials,
        'host': host,
        #'user_image': session['user_image'],
        'role': role,
        'opentok_api_key': OPENTOK_API_KEY,
        'opentok_session_id': opentok_session_id,
        'opentok_token': opentok_token,
        'launch_id': launch_id
    }

    if 'Instructor' in role:
        session['roles'] = 'Instructor'
        return render_template('admin.html', jsconfig=json.dumps(jsonconfig), jssession=json.dumps(jsonsession))
    else:
        session['roles'] = 'Student'
        jsonsession['teacher_session_id'] = auth[launch_id]['teacher_session_id']
        return render_template('student.html', jsconfig=json.dumps(jsonconfig), jssession=json.dumps(jsonsession))

@app.route("/test-starter")
def show_starter():
    host = app.config.get('host')
    logging.info(request.view_args.items())
    jsonconfig = {
        'PUSHER_APP_KEY': json.dumps(pusher_key_config['PUSHER_APP_KEY']).replace('"', ''),
        'iframeUrl': 'http://snap.berkeley.edu/snapsource/snap.html'
    }
    iframeUrl = ndb.Key('Setting', '1207667iframeUrl').get()
    if (iframeUrl):
        jsonconfig['iframeUrl'] = json.dumps(iframeUrl.value).replace('"', '')
    jsonsession = {
        'full_name': 'test',
        'course_id': '1207667',
        'user_id': 'asdasdas', #'8791939',
        'role': 'Instructor'
    }
    student = ndb.Key('Student', jsonsession['course_id'] + jsonsession['user_id']).get()
    if (student and student.primaryRemoteLink):
        jsonsession['remote_link'] = json.dumps(student.primaryRemoteLink).replace('"', '')
    return render_template('student.html', jsconfig=jsonconfig, jssession=jsonsession, host=host)


@app.route("/test-admin")
def show_adminn():
    host = app.config.get('host')
    jsonconfig = {
        'PUSHER_APP_KEY': json.dumps(pusher_key_config['PUSHER_APP_KEY']).replace('"', ''),
        'iframeUrl': 'http://snap.berkeley.edu/snapsource/snap.html',
        'classSkype': 'https://meet.lync.com/microsoft/samelh/37BHT9O9'
    }
    jsonsession = {
        'full_name': 'test'
    }
    return render_template('admin.html', jsconfig=jsonconfig, jssession=jsonsession, host=host)

'''
@app.route("/starter", methods=['POST'])
def get_starter_info():
    studentId =  cgi.escape(request.form['studentId'])

    rewards = Log.get_by_type(studentId, 'reward')
    weeklyrewards = Log.get_by_type_weekly(studentId, 'reward')

    info = {}
    info["totaltickets"] = rewards.count()
    info["weeklytickets"] = weeklyrewards.count()
    return json.dumps(info)
'''

if __name__ == "__main__":
    app.run(debug=app.config.get('debug'))