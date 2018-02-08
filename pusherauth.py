from flask import Flask, session, request
from pylti.flask import lti

import settings
import logging
import json

from lti import error, auth
from common import app, p, pusher_key_config


@app.route("/pusher/auth", methods=['POST'])
@auth(request='session', error=error, role='any', app=app)
def pusher_authentication(lti=lti):
  auth = p.authenticate(
    channel=request.form['channel_name'],
    socket_id=request.form['socket_id'],
    custom_data={
      u'user_id': session['user_id'],
      u'user_info': {
        u'twitter': u'@pusher'
      }
    }
  )
  return json.dumps(auth)

