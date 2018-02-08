import cgi
from google.appengine.ext import ndb
from flask import Flask, request, render_template, Response

import settings
import logging
import json

import urllib

from common import app
from model import SourceCode

# SNAP CLOUD
@app.route("/SnapCloud", methods=['POST'])
def SNAP_login():
    content = request.get_json(silent=True)
    username = cgi.escape(content["__u"])
    password = cgi.escape(content["__h"])
    if (password == "CHANGEME"):
        return Response(render_template(
            'SNAP_API.txt'),
            headers={'MioCracker': username}
        )
    return ""

@app.route("/SnapCloudRawPublic", methods=['GET'])
def SNAP_Public():
    Username = cgi.escape(request.args.get('Username'))
    ProjectName = cgi.escape(request.args.get('ProjectName'))
    code = ndb.Key('SourceCode', Username + ProjectName).get()
    sourceCode = str(code.sourceCode) if code.sourceCode is not None else ""
    media = str(code.media) if code.media is not None else "<media name=\"" + ProjectName + "\" app=\"Snap! 4.0, http://snap.berkeley.edu\" version=\"1\"></media>"
    return Response("<snapdata>" + sourceCode + media + "</snapdata>", headers={'Content-Type': 'text/html; charset=UTF-8'})

@app.route("/SnapCloud/<URL>", methods=['GET', 'POST'])
def SNAP_Service(URL):
    # Save project
    studentKey = request.headers['MioCracker'] #'8791939'

    if (URL[0:4] == ".1.0"):
        ProjectName = cgi.escape(request.form["ProjectName"])
        Source = request.form["SourceCode"]
        Media = request.form["Media"]
        SourceSize = cgi.escape(request.form["SourceSize"])
        MediaSize = cgi.escape(request.form["MediaSize"])
        key = studentKey + ProjectName
        code = SourceCode.get_or_insert(key, studentKey=studentKey, projectName=ProjectName, sourceCode=Source)
        code.sourceCode = Source
        code.media = Media
        code.sourceSize = SourceSize
        code.mediaSize = MediaSize
        code.put()
        return key
    # Get project list
    if (URL[0:4] == ".2.0"):
        # Retrieve all code
        all_code = SourceCode.get_all(studentKey)
        retVal = []
        for code in all_code:
            projectName = code.projectName.encode('utf-8')
            updated = ""
            notes = ""
            logging.info(projectName)
            retVal.append("ProjectName=" + urllib.quote(projectName) + "&Updated=" + updated + "&Notes=" + notes + "&Public=true")
            logging.info(retVal)
        return " ".join(retVal)
    # Get project
    if (URL[0:4] == ".3.0"):
        return "Not Supported"
    # Get raw project
    if (URL[0:4] == ".4.0"):
        ProjectName = cgi.escape(request.form["ProjectName"])
        code = ndb.Key('SourceCode', studentKey + ProjectName).get()
        sourceCode = str(code.sourceCode) if code.sourceCode is not None else ""
        media = str(code.media) if code.media is not None else "<media name=\"" + ProjectName + "\" app=\"Snap! 4.0, http://snap.berkeley.edu\" version=\"1\"></media>"
        return Response("<snapdata>" + sourceCode + media + "</snapdata>", headers={'Content-Type': 'text/plain'})
    # Delete project
    if (URL[0:4] == ".5.0"):
        ProjectName = cgi.escape(request.form["ProjectName"])
        code = ndb.Key('SourceCode', studentKey + ProjectName)
        code.delete()
        return ""
    # Publish project
    if (URL[0:4] == ".6.0"):
        return "Not supported"
    # Unpublish project
    if (URL[0:4] == ".7.0"):
        return "Not supported"
    # Logout
    if (URL[0:4] == ".8.0"):
        return "Not supported"
    # Change password
    if (URL[0:4] == ".9.0"):
        return "Not supported"
    return "Unknown API call"
