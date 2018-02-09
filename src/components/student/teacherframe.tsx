import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

import Util from '../../utils/util';

import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface TeacherFrameProps {
}

export interface TeacherFrameState {
    audioSource?: any;
    videoSource?: any;
    teacherSharing: boolean;
}

export class TeacherFrame extends React.Component<TeacherFrameProps, TeacherFrameState> {
    private subscriberEventHandlers: any;
    private onSubscribe: (event: any) => any;

    constructor(props: TeacherFrameProps) {
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

                // Bail out early if stream is not a screen share..
                if (event.stream.videoType != 'screen') return;

                const subscriber = subSession.subscribe(event.stream, document.querySelector('#student_subscriber') as HTMLElement, props, (err: any) => {
                    if (err) console.error('<<<', err);
                    // if (err) {
                    //     showMessage('Streaming connection failed. This could be due to a restrictive firewall.');
                    // }
                });

                // Restrict frame rate to help with performance.
                //(subscriber as any).subscribeToVideo(true);
                subscriber.restrictFrameRate(true);

                subscriber.on('connected', (evt: any) => {
                    console.log('Connected to teacher stream');
                    this.setState({ teacherSharing: true })
                });

                // subscriber.on('videoEnabled', (evt: any) => {
                //     console.log('Teacher video enabled');
                // });
                // subscriber.on('videoDisabled', (evt: any) => {
                //     console.log('Teacher video disabled');
                //     if (evt.publishVideo == "publishVideo") {
                //         console.log("Teacher has stopped presenting");
                //     }
                //     this.setState({ teacherSharing: false })
                // });
            });
            subSession.on('streamDestroyed', (event: any) => {
                // Bail out early if stream is not a screen share..
                if (event.stream.videoType != 'screen') return;

                console.log('Disconnected from a teacher stream');
                this.setState({ teacherSharing: false })

            })

            subSession.connect(session.opentok_teacher_token, (error: any) => {
                if (error) {
                    console.error('>>', error);
                    return;
                }
            });
        });
    }

    render() {
        const { teacherSharing } = this.state;

        return <div className="student-sharing">
            <div className={"student-subscriber " + (teacherSharing ? "visible" : "")} id="student_subscriber"></div>
        </div>;
    }
}