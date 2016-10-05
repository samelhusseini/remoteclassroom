
import cgi
from flask import Flask, render_template, redirect, request
from google.appengine.ext import ndb
from google.appengine.ext.ndb import msgprop

from datetime import datetime, timedelta
import json
import logging

from common import app, p, getStudents
from model import Poll, PollAnswer, Log, LogType

@app.route("/admin")
def show_admin():
    return redirect('/dashboard')

@app.route("/newpoll")
def show_admin_new_poll():
    config = json.dumps(app.config.get('config'))
    return render_template('admin/new_poll.html', config=config)

@app.route("/allpolls")
def show_admin_all_polls():
    entries = Poll.get_all().fetch(10)
    for entry in entries:
        entry.answers = PollAnswer.query(PollAnswer.parent == entry.key)
        if entry.type == "poll":
            entry.yes = PollAnswer.query(PollAnswer.parent == entry.key, PollAnswer.answer == "yes").count()
            entry.no = PollAnswer.query(PollAnswer.parent == entry.key, PollAnswer.answer == "no").count()
    config = json.dumps(app.config.get('config'))
    return render_template('admin/all_polls.html', config=config, entries=entries)

@app.route("/dashboard")
def dashboard():
    students = getStudents()
    for student in students:
        student['rewardcount'] = Log.get_by_type(student['studentId'], LogType.REWARD).count()
    entries = Poll.get_todays().fetch(5)
    for entry in entries:
        entry.answers = PollAnswer.query(PollAnswer.parent == entry.key)
        if entry.type == "poll":
            entry.yes = PollAnswer.query(PollAnswer.parent == entry.key, PollAnswer.answer == "yes").count()
            entry.no = PollAnswer.query(PollAnswer.parent == entry.key, PollAnswer.answer == "no").count()
    config = json.dumps(app.config.get('config'))
    return render_template('admin/dashboard.html', config=config, entries=entries, students=students)


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

    reward = Log(type=LogType.REWARD, student=studentId)
    reward.put()

    p.trigger('private-status', 'client-reward', {'studentId': studentId})
    return "Reward received"

@app.route("/ping", methods=['POST'])
def trigger_ping():
    studentId =  cgi.escape(request.form['studentId'])

    pinged = Log(type=LogType.PINGED, student=studentId)
    pinged.put()

    p.trigger('private-status', 'client-ping', {'studentId': studentId})
    return "Ping received"

#endregion