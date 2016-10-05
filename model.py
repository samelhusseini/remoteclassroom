
from google.appengine.ext import ndb
from google.appengine.ext.ndb import msgprop
from datetime import datetime, timedelta
from protorpc import messages
import logging
import json

class LogType(messages.Enum): 
    REGISTERED = 1
    HELP_NEEDED = 2
    REWARD = 3
    ONLINE = 4
    PINGED = 5

class Log(ndb.Model): 
    date = ndb.DateTimeProperty(auto_now_add=True)
    student = ndb.StringProperty(required=True, indexed=True)
    type = msgprop.EnumProperty(LogType, required=True, indexed=True)

    @classmethod
    def get_by_type(cls, studentId, type): 
        return cls.query(ndb.AND(cls.type == type,cls.student == studentId)).order(-cls.date)

    @classmethod
    def get_by_type_weekly(cls, student, type):
        week_ago = datetime.now() - timedelta(days=7)
        return cls.query(ndb.AND(ndb.AND(cls.type == type,cls.student == student),(cls.date > week_ago))).order(-cls.date)

class Poll(ndb.Model):
    date = ndb.DateTimeProperty(auto_now_add=True)
    question = ndb.StringProperty(indexed=False)
    html = ndb.StringProperty(indexed=False)
    type = ndb.StringProperty(indexed=False)

    @classmethod
    def get_all(cls):
        return cls.query().order(-cls.date)

    @classmethod
    def get_todays(cls):
        hours_ago = datetime.now() - timedelta(hours=12)
        return cls.query(cls.date > hours_ago).order(-cls.date)

class PollAnswer(ndb.Model):
    date = ndb.DateTimeProperty(auto_now_add=True)
    studentId = ndb.StringProperty(indexed=False)
    answer = ndb.StringProperty(indexed=True)
    parent = ndb.KeyProperty(kind=Poll)

class Link(ndb.Model):
    link = ndb.StringProperty()