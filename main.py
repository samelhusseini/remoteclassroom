import os
import cgi
from flask import Flask, render_template, redirect, request
from datetime import datetime, timedelta
import json
import logging

from common import app, p, getStudents, getStudent
from model import Log, LogType, Link
import admin

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

@app.route("/help", methods=['POST'])
def trigger_help():
    studentId =  cgi.escape(request.form['studentId'])

    student = getStudent(studentId)
    help = Log(type=LogType.HELP_NEEDED, student=studentId)
    help.put()

    p.trigger('private-status', 'help', {'studentId': studentId, 'student': student})
    return "Help received"

@app.route("/register", methods=['POST'])
def trigger_register():
    studentId =  cgi.escape(request.form['studentId'])

    register = Log(type=LogType.REGISTERED, student=studentId)
    register.put()

    p.trigger('private-status', 'registered', {'studentId': studentId})
    return "Registration received"

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

@app.route("/")
def show_index():
    host = app.config.get('host')
    jsonconfig = json.dumps(app.config.get('config'))
    return render_template('index.html', jsconfig=jsonconfig, host=host)

@app.route("/starter")
def show_starter():
    students = getStudents()
    jsonconfig = json.dumps(app.config.get('config'))
    return render_template('starter.html', jsconfig=jsonconfig, students=students)

@app.route("/starter", methods=['POST'])
def get_starter_info():
    studentId =  cgi.escape(request.form['studentId'])

    rewards = Log.get_by_type(studentId, LogType.REWARD)
    weeklyrewards = Log.get_by_type_weekly(studentId, LogType.REWARD)

    info = {}
    info["totaltickets"] = rewards.count()
    info["weeklytickets"] = weeklyrewards.count()
    return json.dumps(info)


if __name__ == "__main__":
    app.run(debug=app.config.get('debug'))