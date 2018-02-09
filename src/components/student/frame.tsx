import * as React from "react";
import * as ReactDOM from "react-dom";

import {Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input} from 'semantic-ui-react';

import Util from '../../utils/util';

import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react';

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface FrameProps {
    url?: string;
}

export interface FrameState {
    audioSource?: any;
    videoSource?: any;
    teacherSharing: boolean;
}

export class Frame extends React.Component<FrameProps, FrameState> {
    private subscriberEventHandlers: any;
    private onSubscribe: (event: any) => any;

    constructor(props: FrameProps) {
        super(props);

        this.state = {
            audioSource: null,
            teacherSharing: false
        };
    }

    componentDidMount() {
        OT.getDevices((err, devices) => {
            const audioDevices = devices.filter(device => device.kind === 'audioInput');

            const subSession = OT.initSession(session.opentok_api_key, session.opentok_teacher_session_id);

            subSession.on('streamCreated', (event: any) => {
                let props: any = {
                    insertMode: 'append',
                    width: 100,
                    height: 100
                };

                if (event.stream.hasVideo) {
                    props.width = 800;
                    props.height = 600;
                }

                const subscriber = subSession.subscribe(event.stream, document.querySelector('#student_subscriber') as HTMLElement, props, (err: any) => console.error('<<<', err));

                subscriber.on('videoEnabled', (evt: any) => this.setState({ teacherSharing: true }));
                subscriber.on('videoDisabled', (evt: any) => this.setState({ teacherSharing: false }));
            });

            subSession.connect(session.opentok_teacher_token, (error: any) => {
                if (error) {
                    console.error('>>', error);
                    return;
                }
            });

            const pubSession = OT.initSession(session.opentok_api_key, session.opentok_session_id);

            pubSession.connect(session.opentok_token, (error: any) => {
                if (error) {
                    console.error('>>', error);
                    return;
                }

                OT.getUserMedia({ audioSource: audioDevices[0].deviceId, videoSource: null })
                    .then(stream => {
                        const publisher1 = OT.initPublisher(document.querySelector('#student_publisher_audio') as HTMLElement, { width: 100, height: 100, publishVideo: false, publishAudio: true, videoSource: null, audioSource: audioDevices[0].deviceId });
                        pubSession.publish(publisher1, (err: any) => console.error('Publishing audio error:', err));
                    });
                
                const publisher2 = OT.initPublisher(document.querySelector('#student_publisher_video') as HTMLElement, { width: 100, height: 100, publishVideo: true, publishAudio: false, videoSource: 'screen', audioSource: null });
                pubSession.publish(publisher2, (err: any) => console.error('Publishing video error:', err));
            });
        });
    }

    render() {
        const {url} = this.props;
        const {teacherSharing} = this.state;

        return <div className="student-view">
                <div className="student-sharing">
                    <div className="student-publisher" id="student_publisher_audio"></div>
                    <div className="student-publisher" id="student_publisher_video"></div>
                    <div className={"student-subscriber " + (teacherSharing ? "hidden" : "")} id="student_subscriber"></div>
                </div>
                <iframe id="content-iframe" src={url}
                        sandbox="allow-top-navigation allow-scripts allow-same-origin"></iframe>
        </div>;
    }
}