import cgi
from google.appengine.ext import ndb
import ndb_json

from flask import Flask, render_template, session, request, redirect, Response, jsonify
from pylti.flask import lti, default_error, wraps, LTIException, LTI
from pylti.common import LTI_SESSION_KEY

import settings
import json

import logging

from common import app, p, pusher_key_config
from model import Log, Setting, Student, entity_to_dict, DateTimeJSONEncoder

from common import feedUpdated, newMessage, newStudentMessage, registerUpdated, configChanged, loadedUpdated, generate_color

from canvas_read import CanvasReader

import requests
import requests_toolbelt.adapters.appengine

# Use the App Engine Requests adapter. This makes sure that Requests uses
# URLFetch.
requests_toolbelt.adapters.appengine.monkeypatch()

# ============================================
# Utility Functions, Decorators
# ============================================

def return_error(msg):
    return render_template('error.html', msg=msg)


def error(exception=None):
    app.logger.error("PyLTI error: {}".format(exception))
    return return_error('''Authentication error,
        please refresh and try again. If this error persists,
        please contact support.''')


def auth(app=None, request='any', error=default_error, role='any',
        *lti_args, **lti_kwargs):
    """
    Auth decorator
    :param: app - Flask App object (optional).
        :py:attr:`flask.current_app` is used if no object is passed in.
    :param: error - Callback if LTI throws exception (optional).
        :py:attr:`pylti.flask.default_error` is the default.
    :param: request - Request type from
        :py:attr:`pylti.common.LTI_REQUEST_TYPE`. (default: any)
    :param: roles - LTI Role (default: any)
    :return: wrapper
    """

    def _auth(function):
        """
        Inner LTI decorator
        :param: function:
        :return:
        """

        @wraps(function)
        def wrapper(*args, **kwargs):
            """
            Pass LTI reference to function or return error.
            """
            try:
                the_lti = LTI(lti_args, lti_kwargs)
                the_lti.verify()
                the_lti._check_role()  # pylint: disable=protected-access
                kwargs['lti'] = the_lti
                return function(*args, **kwargs)
            except LTIException as lti_exception:

                error = lti_kwargs.get('error')
                exception = dict()
                exception['exception'] = lti_exception
                exception['kwargs'] = kwargs
                exception['args'] = args
                return error(exception=exception)

        return wrapper

    lti_kwargs['request'] = request
    lti_kwargs['error'] = error
    lti_kwargs['role'] = role

    if (not app) or isinstance(app, Flask):
        lti_kwargs['app'] = app
        return _auth
    else:
        # We are wrapping without arguments
        lti_kwargs['app'] = None
        return _auth(app)

# ============================================
# Web Views / Routes
# ============================================

# LTI Launch
@app.route('/launch', methods=['POST', 'GET'])
@auth(error=error, request='initial', role='any', app=app)
def launch(lti=lti):
    """
    Returns the launch page
    request.form will contain all the lti params
    """

    # example of getting lti data from the request
    # let's just store it in our session
    session['full_name'] = request.form.get('lis_person_name_full')

    # Write the lti params to the console
    app.logger.info(json.dumps(request.form, indent=2))

    session['guid'] = request.form.get('tool_consumer_instance_guid')
    session['course_id'] = request.form.get('custom_canvas_course_id')
    session['user_id'] = request.form.get('custom_canvas_user_id')
    session['user_color'] = generate_color()

    roles = request.form.get('roles')
    session['user_image'] = request.form.get('user_image')

    session[LTI_SESSION_KEY] = True
    session['oauth_consumer_key'] = settings.CONSUMER_KEY

    if 'Learner' in roles.split(','):
        session['roles'] = 'Student'
        return redirect("/student")

    if 'Instructor' in roles.split(','):
        session['roles'] = 'Instructor'
        return redirect("/admin")

    return render_template('ltiindex.html', lis_person_name_full=session['lis_person_name_full'])

# Student Launch
@app.route("/student", methods=['POST', 'GET'])
@auth(request='session', error=error, role='any', app=app)
def student(lti=lti):
    jsonsession = {
        'guid': session['guid'],
        'course_id': session['course_id'],
        'user_id': session['user_id'],
        'full_name': session['full_name'],
        'user_image': session['user_image'],
        'user_color': session['user_color'],
        'role': session['roles']
    }
    classSkype = ndb.Key('Setting', session['course_id'] + 'classSkype').get()
    iframeUrl = ndb.Key('Setting', session['course_id'] + 'iframeUrl').get()
    jsonconfig = {
        'PUSHER_APP_KEY': json.dumps(pusher_key_config['PUSHER_APP_KEY']).replace('"', ''),
        'iframeUrl': json.dumps(iframeUrl.value).replace('"', '') if iframeUrl else '',
        'classSkype': json.dumps(classSkype.value).replace('"', '') if classSkype else ''
    }
    if session['roles'] == "Student":
        student = ndb.Key('Student', session['course_id'] + session['user_id']).get()
        if (student and student.primaryRemoteLink):
            jsonsession['remote_link'] = json.dumps(student.primaryRemoteLink).replace('"', '')
        jsonsession['user_initials'] = student.initials
        host = app.config.get('host')
        trigger_loaded(session['course_id'], session['user_id'])
        return render_template('student.html', jsconfig=json.dumps(jsonconfig), jssession=json.dumps(jsonsession), host=host)
    if session['roles'] == "Instructor":
        host = app.config.get('host')
        return render_template('student.html', jsconfig=json.dumps(jsonconfig), jssession=json.dumps(jsonsession), host=host)
    return "Please launch Remote Class to verify login"



# Instructor Launch
@app.route("/admin", methods=['POST', 'GET'])
@auth(request='session', error=error, role='staff', app=app)
def admin(lti=lti):
    jsonsession = {
        'guid': session['guid'],
        'course_id': session['course_id'],
        'user_id': session['user_id'],
        'full_name': session['full_name'],
        'user_image': session['user_image'],
        'user_color': session['user_color'],
        'user_initials': session['user_initials'],
        'role': session['roles']
    }
    classSkype = ndb.Key('Setting', session['course_id'] + 'classSkype').get()
    iframeUrl = ndb.Key('Setting', session['course_id'] + 'iframeUrl').get()
    jsonconfig = {
        'PUSHER_APP_KEY': json.dumps(pusher_key_config['PUSHER_APP_KEY']).replace('"', ''),
        'iframeUrl': json.dumps(iframeUrl.value).replace('"', '') if iframeUrl else '',
        'classSkype': json.dumps(classSkype.value).replace('"', '') if classSkype else ''
    }
    host = app.config.get('host')
    return render_template('admin.html', jsconfig=json.dumps(jsonconfig), jssession=json.dumps(jsonsession), host=host)



# LTI Launch
@app.route('/launch_class', methods=['POST', 'GET'])
@auth(error=error, request='initial', role='any', app=app)
def launch_class(lti=lti):
    """
    Returns the launch page
    request.form will contain all the lti params
    """
    session['course_id'] = request.form.get('custom_canvas_course_id')
    session['user_id'] = request.form.get('custom_canvas_user_id')
    roles = request.form.get('roles')

    if 'Learner' in roles.split(','):
        student = ndb.Key('Student', session['course_id'] + session['user_id']).get()
        if (student and student.primaryRemoteLink):
            return redirect(json.dumps(student.primaryRemoteLink).replace('"', ''))

    if 'Instructor' in roles.split(','):
        session['roles'] = 'Instructor'
        return redirect("https://meet.lync.com/microsoft/samelh/37BHT9O9")
    
    app.logger.error("Error with Classroom session.")
    return return_error('''Error with Classroom session. Please refresh and try again. If this error persists,
        please contact support.''')

# LTI XML Configuration
@app.route("/xml/", methods=['GET'])
def xml():
    """
    Returns the lti.xml file for the app.
    """
    try:
        return Response(render_template(
            'lti.xml'), mimetype='application/xml'
        )
    except:
        app.logger.error("Error with XML.")
        return return_error('''Error with XML. Please refresh and try again. If this error persists,
            please contact support.''')

# LTI XML Configuration
@app.route("/xml_class/", methods=['GET'])
def xml_class():
    """
    Returns the lti.xml file for the app.
    """
    try:
        return Response(render_template(
            'class.xml'), mimetype='application/xml'
        )
    except:
        app.logger.error("Error with XML.")
        return return_error('''Error with XML. Please refresh and try again. If this error persists,
            please contact support.''')


@app.route("/.well-known/acme-challenge/ZCYg-4cp9zP3ihybHYQOa7wSIWV0ffVvboGnBdkSzbk", methods=['GET'])
def verification():
    """
    Returns the lti.xml file for the app.
    """
    try:
        return Response(render_template(
            'verification.xml'), mimetype='application/text'
        )
    except:
        app.logger.error("Error with XML.")
        return return_error('''Error with XML. Please refresh and try again. If this error persists,
            please contact support.''')


@app.route("/.well-known/acme-challenge/yUYJl_O1Z6LCXNT5nzyfSERZDyU4437sUY5uvjlT0Dw", methods=['GET'])
def www_verification():
    """
    Returns the lti.xml file for the app.
    """
    try:
        return Response(render_template(
            'www.verification.xml'), mimetype='application/text'
        )
    except:
        app.logger.error("Error with XML.")
        return return_error('''Error with XML. Please refresh and try again. If this error persists,
            please contact support.''')

'''
@app.route("/importusers", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def import_users(lti=lti):
#def import_users():
    content = request.get_json(silent=True)
    oauth_token = cgi.escape(content['token'])
    courseId = cgi.escape(content['courseId'])
    base_url = "https://canvas.instructure.com"
    api_prefix = "/api/v1"
    canvas = CanvasReader(oauth_token, base_url, api_prefix, verbose=True)
    users = canvas.get_users(courseId)
    for user in users:
        studentId = str(user['id'])
        user_info = canvas.get_user_profile(studentId)
        logging.info(user_info)
        shortName = user['short_name']
        avatarUrl = user_info['avatar_url']
        key = courseId + studentId
        student = Student.get_or_insert(key, studentId=studentId, courseId=courseId, fullName=shortName, avatarUrl=avatarUrl)
        student.fullName = shortName
        student.avatarUrl = avatarUrl
        student.put()
    configChanged(courseId, 'config', 'users')
    return ""
'''

@app.route("/feed", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def get_feed(lti=lti):
#def get_feed():
    content = request.get_json(silent=True)
    courseId = cgi.escape(content['courseId'])
    feeds = Log.get_by_course(courseId)
    jsonfeeds = []
    for feed in feeds:
        jsonfeed = entity_to_dict(feed, ['student', 'type'], ['date', 'key'])
        jsonfeed["date"] = DateTimeJSONEncoder().encode(feed.date).replace('"', '')
        student = ndb.Key('Student', courseId + feed.student).get()
        if (student):
            jsonfeed["fullName"] = student.fullName
            jsonfeed["avatarUrl"] = student.avatarUrl
        jsonfeeds.append(jsonfeed)
    return json.dumps(jsonfeeds)

@app.route("/messages", methods=['GET'])
@auth(request='session', error=error, role='any', app=app)
def get_messages(lti=lti):
#def get_messages():
    after_id = request.args.get('after_id', 0)
    courseId = request.args.get('courseId', 0)

    messages = Log.get_by_course(courseId)
    messagefeeds = []
    for message in messages:
        messagefeed = entity_to_dict(message, ['student', 'type', 'content'], ['date', 'key'])
        messagefeed["date"] = DateTimeJSONEncoder().encode(message.date).replace('"', '')
        student = ndb.Key('Student', courseId + (message.teacher if message.teacher else message.student)).get()
        if (student):
            messagefeed['info'] = student.info()
        messagefeeds.append(messagefeed)
    return json.dumps(messagefeeds)

@app.route("/studentmessages", methods=['GET'])
@auth(request='session', error=error, role='any', app=app)
def get_student_messages(lti=lti):
#def get_student_messages():
    after_id = request.args.get('after_id', 0)
    courseId = request.args.get('courseId', 0)
    studentId = request.args.get('studentId', 0)

    messages = Log.get_by_course_and_student(courseId, studentId)
    messagefeeds = []
    for message in messages:
        messagefeed = entity_to_dict(message, ['student', 'type', 'content'], ['date', 'key'])
        messagefeed["date"] = DateTimeJSONEncoder().encode(message.date).replace('"', '')
        student = ndb.Key('Student', courseId + (message.teacher if message.teacher else message.student)).get()
        
        if (student):
            messagefeed['info'] = student.info()
        messagefeeds.append(messagefeed)
    return json.dumps(messagefeeds)

@app.route("/new_student_message", methods=['POST'])
@auth(request='session', error=error, role='student', app=app)
def new_student_message(lti=lti):
#def new_student_message():
    content = request.get_json(silent=True)
    logging.info(content)
    studentId = cgi.escape(content['studentId'])
    courseId = cgi.escape(content['courseId'])
    text = cgi.escape(content['text'])

    student_key = ndb.Key('Student', courseId + studentId)
    student = student_key.get()
    message = Log(type='text', courseId=courseId, student=studentId)
    message.content = text
    message.put()

    fullName = student.fullName if student else 'Unknown student'
    avatarUrl = student.avatarUrl if student else ''

    newStudentMessage(courseId, studentId, {
        'student': studentId,
        'courseId': courseId,
        'id': message.key.id(),
        'type': 'text',
        'content': text,
        'info': student.info(),
        'date': DateTimeJSONEncoder().encode(message.date).replace('"', '')
    })
    newMessage(courseId, {
        'student': studentId,
        'courseId': courseId,
        'id': message.key.id(),
        'type': 'text',
        'info': student.info(),
        'content': text,
        'date': DateTimeJSONEncoder().encode(message.date).replace('"', '')
    })
    return "Message received"


@app.route("/new_teacher_message", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def new_teacher_message(lti=lti):
#def new_teacher_message():
    content = request.get_json(silent=True)
    logging.info(content)
    studentId = cgi.escape(content['studentId'])
    teacherId = cgi.escape(content['teacherId'])
    courseId = cgi.escape(content['courseId'])
    text = cgi.escape(content['text'])

    student_key = ndb.Key('Student', courseId + studentId)
    student = student_key.get()
    teacher_key = ndb.Key('Student', courseId + teacherId)
    teacher = teacher_key.get()

    message = Log(type='text', courseId=courseId, student=studentId)
    message.content = text
    message.teacher = teacherId
    message.put()

    newStudentMessage(courseId, studentId, {
        'student': teacherId,
        'courseId': courseId,
        'id': message.key.id(),
        'type': 'text',
        'content': text,
        'info': student.info(),
        'teacherinfo': teacher.info(),
        'date': DateTimeJSONEncoder().encode(message.date).replace('"', '')
    })
    newMessage(courseId, {
        'student': studentId,
        'courseId': courseId,
        'id': message.key.id(),
        'type': 'text',
        'content': text,
        'info': student.info(),
        'teacherinfo': teacher.info(),
        'date': DateTimeJSONEncoder().encode(message.date).replace('"', '')
    })
    return "Message received"

@app.route("/new_message", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def new_message(lti=lti):
#def new_message():
    content = request.get_json(silent=True)
    logging.info(content)
    studentId = cgi.escape(content['studentId']) #From Field
    courseId = cgi.escape(content['courseId'])
    text = cgi.escape(content['text'])

    student_key = ndb.Key('Student', courseId + studentId)
    student = student_key.get()
    message = Log(type='text', courseId=courseId, student=studentId)
    message.content = text
    message.put()

    fullName = student.fullName if student else 'Unknown student'
    avatarUrl = student.avatarUrl if student else ''

    newMessage(courseId, {
        'student': studentId, #Broadcast message from:
        'courseId': courseId,
        'id': message.key.id(),
        'type': 'text',
        'content': text,
        'info': student.info(),
        'date': ''
    })
    return "Message received"


@app.route("/users", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def get_users(lti=lti):
#def get_users():
    content = request.get_json(silent=True)
    courseId = cgi.escape(content['courseId'])
    users = Student.get_students_by_course(courseId)
    return users

@app.route("/delete_user", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def delete_user(lti=lti):
    content = request.get_json(silent=True)
    studentId = cgi.escape(content['studentId'])
    courseId = cgi.escape(content['courseId'])
    student_key = ndb.Key('Student', courseId + studentId)
    student_key.delete()
    configChanged(courseId, 'config', 'users')
    return "Deleted"

@app.route("/update_primary", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def update_primary(lti=lti):
#def update_primary():
    content = request.get_json(silent=True)
    studentId = cgi.escape(content['studentId'])
    courseId = cgi.escape(content['courseId'])
    primaryLink = cgi.escape(content['primaryLink'])
    student = ndb.Key('Student', courseId + studentId).get()
    student.primaryRemoteLink = primaryLink
    student.put()
    configChanged(courseId, 'config', 'users')
    return "Updated primary"

@app.route("/update_secondary", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def update_secondary(lti=lti):
    content = request.get_json(silent=True)
    studentId = cgi.escape(content['studentId'])
    courseId = cgi.escape(content['courseId'])
    secondaryLink = cgi.escape(content['secondaryLink'])
    student = ndb.Key('Student', courseId + studentId).get()
    student.secondaryRemoteLink = secondaryLink
    student.put()
    configChanged(courseId, 'config', 'users')
    return "Updated primary"

@app.route("/update_settings", methods=['POST'])
@auth(request='session', error=error, role='staff', app=app)
def update_settings(lti=lti):
#def update_settings():
    content = request.get_json(silent=True)
    courseId = cgi.escape(content['courseId'])
    name = cgi.escape(content['settingName'])
    value = cgi.escape(content['settingValue'])
    setting = Setting.get_or_insert(courseId + name, courseId=courseId, name=name, value=value)
    setting.value = value
    setting.put()
    configChanged(courseId, name, value)
    return "Updated settings"

@app.route("/help", methods=['POST'])
@auth(request='session', error=error, role='student', app=app)
def trigger_help(lti=lti):
#def trigger_help():
    content = request.get_json(silent=True)
    logging.info(content)
    studentId = cgi.escape(content['studentId'])
    studentName = cgi.escape(content['studentName'])
    courseId = cgi.escape(content['courseId'])

    student = ndb.Key('Student', courseId + studentId).get()
    help = Log(type='help', courseId=courseId, student=studentId)
    help.put()

    fullName = student.fullName if student else 'Unknown student'
    avatarUrl = student.avatarUrl if student else ''

    feedUpdated(courseId, {
        'student': studentId,
        'fullName': fullName,
        'avatarUrl': avatarUrl
    })

    newMessage(courseId, {
        'student': studentId,
        'courseId': courseId,
        'id': help.key.id(),
        'type': 'help',
        'content': '',
        'info': student.info(),
        'date': DateTimeJSONEncoder().encode(help.date).replace('"', '')
    })
    return "Help received"

@app.route("/register", methods=['POST'])
@auth(request='session', error=error, role='student', app=app)
def trigger_register(lti=lti):
    content = request.get_json(silent=True)
    studentId = cgi.escape(content['studentId'])
    courseId = cgi.escape(content['courseId'])

    register = Log(type='registered', courseId=courseId, student=studentId)
    register.put()

    registerUpdated(courseId, {
        'student': studentId
    })
    return "Registration received"


def trigger_loaded(courseId, studentId):
    loaded = Log(type='loaded', courseId=courseId, student=studentId)
    loaded.put()

    loadedUpdated(courseId, {
        'student': studentId
    })