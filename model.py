
from google.appengine.ext import ndb
from google.appengine.ext.ndb import msgprop
from datetime import datetime, timedelta
from protorpc import messages
import logging
import json

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            encoded_object = list(obj.timetuple())[0:6]
        else:
            encoded_object =json.JSONEncoder.default(self, obj)
        return encoded_object

class Log(ndb.Model):
    date = ndb.DateTimeProperty(auto_now_add=True)
    student = ndb.StringProperty(required=True, indexed=True)
    courseId = ndb.StringProperty(required=True, indexed=True)
    type = ndb.StringProperty(required=True, indexed=True)
    teacher = ndb.StringProperty(indexed=True)
    content = ndb.StringProperty()

    @classmethod
    def get_by_type(cls, studentId, courseId, type): 
        return cls.query(ndb.AND(cls.type == type, cls.student == studentId, cls.courseId == courseId)).order(-cls.date)

    @classmethod
    def get_by_course(cls, courseId):
        day_ago = datetime.now() - timedelta(hours=8)
        return cls.query(ndb.AND(cls.courseId == courseId,(cls.date > day_ago))).order(-cls.date).fetch(15)

    @classmethod
    def get_by_course_and_student(cls, courseId, studentId):
        day_ago = datetime.now() - timedelta(hours=8)
        return cls.query(ndb.AND(ndb.AND(cls.courseId == courseId,(cls.date > day_ago)), cls.student == studentId)).order(-cls.date).fetch(15)

    @classmethod
    def get_by_type_weekly(cls, student, type):
        week_ago = datetime.now() - timedelta(days=7)
        return cls.query(ndb.AND(ndb.AND(cls.type == type, cls.student == student),(cls.date > week_ago))).order(-cls.date)

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

class Setting(ndb.Model):
    courseId = ndb.StringProperty(indexed=True, required=True)
    name = ndb.StringProperty(indexed=True)
    value = ndb.StringProperty()

    @classmethod
    def get_by_course(cls, courseId):
        return cls.query(cls.courseId == courseId).fetch()

    @classmethod
    def get_value_by_course(cls, courseId, name):
        return cls.query(ndb.AND(cls.courseId == courseId, cls.name == name)).fetch()

class Course(ndb.Model):
    date = ndb.DateTimeProperty(auto_now_add=True)
    courseId = ndb.StringProperty(indexed=True, required=True)


class Student(ndb.Model): 
    date = ndb.DateTimeProperty(auto_now_add=True)
    studentId = ndb.StringProperty(indexed=False, required=True)
    courseId = ndb.StringProperty(indexed=True, required=True)
    fullName = ndb.StringProperty(indexed=True)
    role = ndb.StringProperty(required=True, default='STUDENT')

    initials = ndb.ComputedProperty(lambda self: ''.join([x[0].upper() for x in self.fullName.split(' ')]))
    color = ndb.StringProperty(indexed=False)
    
    avatarUrl = ndb.StringProperty(indexed=False)
    primaryRemoteLink = ndb.StringProperty(indexed=False)
    secondaryRemoteLink = ndb.StringProperty(indexed=False)

    @classmethod
    def get_students_by_course(cls, courseId):
        return json.dumps([l.to_dict() for l in cls.query(ndb.AND(cls.courseId == courseId, cls.role == 'STUDENT')).order(cls.fullName).fetch()], cls=DateTimeEncoder)

class SourceCode(ndb.Model):
    studentKey = ndb.StringProperty(indexed=True, required=True)
    projectName = ndb.StringProperty(indexed=True, required=True)
    sourceCode = ndb.TextProperty(required=True)
    sourceSize = ndb.StringProperty()
    media = ndb.TextProperty()
    mediaSize = ndb.StringProperty()

    @classmethod
    def get_all(cls, studentKey):
        return cls.query(cls.studentKey == studentKey).order(cls.projectName).fetch()

class DateTimeJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        else:
            return super(DateTimeJSONEncoder, self).default(obj)

def entity_to_dict(self, includes=None, excludes=None):
    """Encodes an `ndb.Model` to a `dict`. By default, only `ndb.Property`
    attributes are included in the result.
        :param include:
            List of strings keys of class attributes. Can be the name of the
            either a method or property.
        :param exclude:
            List of string keys to omit from the return value.
        :returns: Instance of `dict`.
        :raises: `ValueError` if any key in the `include` param doesn't exist.
    """
    value = ndb.Model.to_dict(self)
    # set the `id` of the entity's key by default..
    if self.key:
        value['key'] = self.key.urlsafe()
        value['id'] = self.key.id()
    if includes:
        for inc in includes:
            attr = getattr(self, inc, None)
            if attr is None:
                cls = self.__class__
                logging.warn('entity_to_dict cannot encode `%s`. Property is \
not defined on `%s.%s`.', inc, cls.__module__, cls.__name__)
                continue
            if callable(attr):
                value[inc] = attr()
            else:
                value[inc] = attr
    if excludes:
        # exclude items from the result dict, by popping the keys
        # from the dict..
        [value.pop(exc) for exc in excludes
            if exc in value]
    return value