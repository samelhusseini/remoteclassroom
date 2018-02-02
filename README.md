# remoteclassroom
Virtual Classroom for remote teaching

![](https://travis-ci.org/sammysamau/remoteclassroom.svg?branch=master)

Try it now at http://remoteclass.school/create

## Development

1. Install python ([https://www.python.org/downloads/](https://www.python.org/downloads/)). Then run the following in the root of the project directory.

```
pip2.7 install -t lib -r requirements.txt
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


## Running locally

In a terminal window, run webpack: 
```
webpack --watch
```

In another terminal window, run the local server: 
```
dev_appserver.py app.yaml
```

## License

MIT
