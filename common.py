import pusher, pusher.gae

import os
import cgi

from flask import Flask
from google.appengine.ext import ndb
from google.appengine.ext.ndb import msgprop
from datetime import datetime, timedelta
from protorpc import messages
import logging
import json

app = Flask(__name__)

fName = './config.sample.json'
if os.path.isfile(fName): 
    fName = './config.json'
with open(fName) as f:
    config = json.load(f)
app.config.update(config)

app_id = os.environ.get('PUSHER_APP_ID')
key = os.environ.get('PUSHER_APP_KEY')
secret = os.environ.get('PUSHER_APP_SECRET')

p = pusher.Pusher(
  app_id=app_id,
  key=key,
  secret=secret,
  backend=pusher.gae.GAEBackend
)

def getStudents():
    studentlist = app.config.get('students')
    students = []
    for k, v in studentlist.items():
        student = v
        student['name'] = student['first_name'] + " " + student['last_name']
        if student['enabled'] == 'true':
            students.append(student)
    students = sorted(students, key=lambda student: student['last_name'])
    return students