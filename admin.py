
import cgi
from flask import Flask, render_template, redirect, request
from google.appengine.ext import ndb
from google.appengine.ext.ndb import msgprop

from datetime import datetime, timedelta
import json
import logging
import requests

from canvas_read import CanvasReader

from common import app, p, getStudents, getMeetings, getStudent, getStudentName
from model import Poll, PollAnswer, Log

@app.route("/adminn")
def show_admin():
    return redirect('/dashboard')

@app.route("/newpoll")
def show_admin_new_poll():
    jsonconfig = json.dumps(app.config.get('config'))
    return render_template('admin/new_poll.html', jsconfig=jsonconfig)

@app.route("/allpolls")
def show_admin_all_polls():
    entries = Poll.get_all().fetch(10)
    for entry in entries:
        entry.answers = PollAnswer.query(PollAnswer.parent == entry.key)
        for answer in entry.answers:
            answer.student = getStudent(answer.studentId)
            answer.studentName = getStudentName(answer.student)
        if entry.type == "poll":
            entry.yes = PollAnswer.query(PollAnswer.parent == entry.key, PollAnswer.answer == "yes").count()
            entry.no = PollAnswer.query(PollAnswer.parent == entry.key, PollAnswer.answer == "no").count()
    jsonconfig = json.dumps(app.config.get('config'))
    return render_template('admin/all_polls.html', jsconfig=jsonconfig, entries=entries)

@app.route("/dashboard")
def dashboard():
    students = getStudents()
    meetings = getMeetings()
    for student in students:
        student['rewardcount'] = Log.get_by_type(student['studentId'], 'reward').count()
    entries = Poll.get_todays().fetch(5)
    for entry in entries:
        entry.answers = PollAnswer.query(PollAnswer.parent == entry.key)
        for answer in entry.answers:
            answer.student = getStudent(answer.studentId)
            answer.studentName = getStudentName(answer.student)
        if entry.type == "poll":
            entry.yes = PollAnswer.query(PollAnswer.parent == entry.key, PollAnswer.answer == "yes").count()
            entry.no = PollAnswer.query(PollAnswer.parent == entry.key, PollAnswer.answer == "no").count()
    jsonconfig = json.dumps(app.config.get('config'))
    return render_template('admin/dashboard.html', jsconfig=jsonconfig, entries=entries, students=students, meetings=meetings)

#region Pusher
@app.route("/poll", methods=['POST'])
def trigger_poll():
    response =  cgi.escape(request.form['message'])
    studentId =  cgi.escape(request.form['student'])
    id = int(cgi.escape(request.form['pollId']))
    poll_key = ndb.Key(Poll, id)
    if poll_key:
        poll_answer = PollAnswer(parent=poll_key)
        poll_answer.answer = response
        poll_answer.studentId = studentId
        poll_answer.put()
        return "Poll received"
    return "Invalid Poll"

@app.route("/survey", methods=['POST'])
def trigger_survey():
    response =  cgi.escape(request.form['message'])
    studentId =  cgi.escape(request.form['student'])
    id = int(cgi.escape(request.form['pollId']))
    poll_key = ndb.Key(Poll, id)
    if poll_key:
        poll_answer = PollAnswer(parent=poll_key)
        poll_answer.answer = response
        poll_answer.studentId = studentId
        poll_answer.put()
        return "Poll received"
    return "Invalid Poll"

@app.route("/newpoll", methods=['POST'])
def trigger_notification():
    header =  cgi.escape(request.form['header'])
    body =  cgi.escape(request.form['body'])
    type = cgi.escape(request.form['type'])

    poll = Poll()
    poll.type = type
    poll.question = header
    poll.html = body
    poll_key = poll.put()
    id = poll_key.id()

    if type == "poll":
        p.trigger('polls', 'new_poll', {'id': id,'header': header, 'body': body, 'title': header})
    elif type == "alert":
        if not body:
            p.trigger('polls', 'new_alert', {'id': id,'title': 'New Announcement', 'body': header})
        else:
            p.trigger('polls', 'new_alert', {'id': id,'title': header, 'body': body})
    elif type == "link":
        p.trigger('polls', 'new_link', {'id': id,'header': header, 'link': body})
    elif type == "quiz": 
        p.trigger('polls', 'quiz', {'id': id})
    else:
        p.trigger('polls', 'new_survey', {'id': id, 'header': header, 'body': body})
    return redirect("/allpolls")

@app.route("/reward", methods=['POST'])
def trigger_reward():
    studentId =  cgi.escape(request.form['studentId'])
    student = getStudent(studentId)

    reward = Log(type='reward', student=studentId)
    reward.put()

    p.trigger('private-status', 'client-reward', {'studentId': studentId, 'student': student})
    return "Reward received"

@app.route("/ping", methods=['POST'])
def trigger_ping():
    studentId =  cgi.escape(request.form['studentId'])
    student = getStudent(studentId)

    pinged = Log(type='ping', student=studentId)
    pinged.put()

    p.trigger('private-status', 'client-ping', {'studentId': studentId, 'student': student})
    return "Ping received"

#endregion