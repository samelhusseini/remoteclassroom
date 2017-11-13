import os
import cgi
from google.appengine.ext import ndb
from flask import Flask, render_template, redirect, request
from datetime import datetime, timedelta
import json
import logging

from common import app, p, getStudents, getMeetings, getStudent, pusher_key_config
from model import Log, Student

from common import feedUpdated, configChanged
import admin
import lti

from canvas_read import CanvasReader

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
    return render_template('index.html', jsconfig=jsonconfig, jssession=jsonsession, host=host)


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