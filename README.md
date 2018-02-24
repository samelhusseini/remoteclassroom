# remoteclassroom
Virtual Classroom for remote teaching

Try it now at http://remoteclass.school/create

## Development

1. Install python ([https://www.python.org/downloads/](https://www.python.org/downloads/)). Then run the following in the root of the project directory.

1a.
install `virtualenv`:

```
pip install virtualenv
```

1b. switch to a new Python' virtual environment called `env`:

```
virtualenv env
source env/bin/activate
```

1c. install API dependencies:

```
pip install -t lib -r requirements.txt
```

2. Install [node](https://nodejs.org/en/download/) and project dependencies using npm.

```
npm install
```

3. Install webpack globally

```
npm install -g webpack
```

4. Follow the Google Cloud SDK install steps to install gcloud on your platform:
https://cloud.google.com/sdk/downloads

5. Install [ngrok](https://ngrok.com/)


## Running locally

In a terminal window, run webpack: 

```
webpack --watch
```

In another terminal window, run the local server: 

```
dev_appserver.py app.yaml
```

Expose the dev server over ngrok proxy to be able to use https:

```
hgrok http 8080
```

Then navigate to the `https://` URL, provided by ngrok to open up the teacher's view.
Use the "add student" button to get the student view URL.

## License

Apache License 2.0
