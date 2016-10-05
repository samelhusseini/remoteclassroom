import pusher, pusher.gae

import os
import cgi
from flask import Flask, render_template, redirect, request
from datetime import datetime, timedelta
import json
import logging

from common import app, p, getStudents
from model import Log, LogType
import admin

@app.route("/class")
def show_class():
    link = Link.get_by_id('class_link')
    return redirect(link.link)

@app.route("/classroom")
def show_classroom():
    link = Link.get_by_id('class_link')
    return redirect(link.link + "?sl=")

@app.route("/oldclass")
def show_old_classroom():
    return redirect('https://join.microsoft.com/meet/samelh/DG4RFMGZ')

@app.route("/classproc")
def show_class_proc():
    return redirect('https://docs.google.com/presentation/d/1kLWV0vnWB-nt6trokBBhjLAUUyo8EEPULvizORI9_QM/edit?usp=sharing')

@app.route("/classprocedures")
def show_class_procedures():
    return redirect('https://docs.google.com/presentation/d/1kLWV0vnWB-nt6trokBBhjLAUUyo8EEPULvizORI9_QM/edit?usp=sharing')

@app.route("/slide")
def show_slide():
    link = Link.get_by_id('slide_link')
    return redirect(link.link)

@app.route("/quiz")
def show_quiz():
    return redirect("https://b.socrative.com/login/student/")

@app.route("/changeclassroom")
def show_admin_change_classlink():
    link = Link.get_by_id('class_link')
    return render_template('admin/classroom_link.html', classlink=link)

@app.route("/changeslide")
def show_admin_change_slidelink():
    link = Link.get_by_id('slide_link')
    return render_template('admin/slide_link.html', slidelink=link)

@app.route("/help", methods=['POST'])
def trigger_help():
    studentId =  cgi.escape(request.form['studentId'])

    help = Log(type=LogType.HELP_NEEDED, student=studentId)
    help.put()

    p.trigger('private-status', 'help', {'studentId': studentId})
    return "Help received"

@app.route("/register", methods=['POST'])
def trigger_register():
    studentId =  cgi.escape(request.form['studentId'])

    register = Log(type=LogType.REGISTERED, student=studentId)
    register.put()

    p.trigger('private-status', 'registered', {'studentId': studentId})
    return "Registration received"

@app.route("/tim")
def go_to_tim():
    return go_to_student('student6')

def go_to_student(studentId):
    student = app.config.get('students')[studentId]
    logging.info(student)
    return redirect(student['skypeMeeting'])

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

@app.route("/")
def show_index():
    host = app.config.get('host')
    return render_template('index.html', host=host)

@app.route("/starter")
def show_starter():
    students = getStudents()
    quiz = app.config.get('quiz')
    quiz['instructions'] = ''.join(quiz['instructions'])
    config = json.dumps(app.config.get('config'))
    return render_template('starter.html', config=config, students=students, quiz=quiz)

@app.route("/starter", methods=['POST'])
def get_starter_info():
    studentId =  cgi.escape(request.form['studentId'])

    rewards = Log.get_by_type(studentId, LogType.REWARD)
    weeklyrewards = Log.get_by_type_weekly(studentId, LogType.REWARD)

    info = {}
    info["totaltickets"] = rewards.count()
    info["weeklytickets"] = weeklyrewards.count()
    return json.dumps(info)

@app.route("/pusher/auth", methods=['POST'])
def pusher_authentication():

    auth = p.authenticate(
        channel=request.form['channel_name'],
        socket_id=request.form['socket_id']
    )
    return json.dumps(auth)

if __name__ == "__main__":
    app.run(debug=True)