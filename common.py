import pusher, pusher.gae

import os
import cgi

from flask import Flask, request
from google.appengine.ext import ndb
from google.appengine.ext.ndb import msgprop
from datetime import datetime, timedelta
from protorpc import messages
import logging
import json

app = Flask(__name__)

fName = './config.json'
if not os.path.exists(fName): 
    fName = './config.sample.json'
with open(fName) as f:
    config = json.load(f)
app.config.update(config)

pusher_config = app.config.get('pusher')
pusher_key_config = app.config.get('config')

p = pusher.Pusher(
  app_id=pusher_config['PUSHER_APP_ID'],
  key=pusher_key_config['PUSHER_APP_KEY'],
  secret=pusher_config['PUSHER_APP_SECRET'],
  backend=pusher.gae.GAEBackend
)

def getStudents():
    studentlist = app.config.get('students')
    students = []
    index = 0
    for k, v in studentlist.items():
        student = v
        student['name'] = getStudentName(student)
        if student['enabled'] == 'true':
            student['index'] = index
            students.append(student)
            index+=1
    students = sorted(students, key=lambda student: student['last_name'])
    return students

def getStudent(studentId):
    students = app.config.get('students')
    if studentId in students:
        return students[studentId]
    return None

def getStudentName(student):
    if student is not None:
        return student['first_name'] + " " + student['last_name']
    return "Anonymous"

@app.route("/pusher/auth", methods=['POST'])
def pusher_authentication():
    auth = p.authenticate(
        channel=request.form['channel_name'],
        socket_id=request.form['socket_id']
    )
    return json.dumps(auth)
