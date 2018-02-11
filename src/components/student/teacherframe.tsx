import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

import Util from '../../utils/util';

import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface TeacherFrameProps {
    setAudioConnected: (connected: boolean) => void;
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

    setAudioConnected(connected: boolean) {
        this.props.setAudioConnected(connected);
    }

    componentDidMount() {
        OT.getDevices((err, devices) => {
            const audioDevices = devices.filter(device => device.kind === 'audioInput');

            const subSession = OT.initSession(session.opentok_api_key, session.opentok_teacher_session_id);

            subSession.on('streamCreated', (event: any) => {
                const audioStream = event.stream.hasAudio;
                const screenShareStream = event.stream.videoType == 'screen';

                // Bail out early if stream is not a screen share..
                if (!audioStream && !screenShareStream) return;

                let props: any = {
                    insertMode: 'append',
                    width: 100,
                    height: 100,
                    subscribeToAudio: audioStream,
                    subscribeToVideo: screenShareStream,
                    insertDefaultUI: !audioStream
                };

                if (event.stream.hasVideo) {
                    props.width = 800;
                    props.height = 600;
                }

                const subscriber = subSession.subscribe(event.stream, audioStream ? undefined : document.querySelector('#student_subscriber') as HTMLElement, props, (err: any) => {
                    if (err) console.error('<<<', err);
                    // if (err) {
                    //     showMessage('Streaming connection failed. This could be due to a restrictive firewall.');
                    // }
                });

                // Restrict frame rate to help with performance.
                //(subscriber as any).subscribeToVideo(true);
                if (screenShareStream) subscriber.restrictFrameRate(true);

                subscriber.on('connected', (evt: any) => {
                    console.log('Connected to teacher stream.');

                    if (evt.target.stream.videoType == 'screen') this.setState({ teacherSharing: true })
                    else if (evt.target.stream.hasAudio) this.setAudioConnected(true);
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

            subSession.on('streamDestroyed', (evt: any) => {
                if (!evt.stream) return;

                console.log('Disconnected from a teacher stream');

                if (evt.stream.videoType == 'screen') this.setState({ teacherSharing: false })
                else if (evt.stream.hasAudio) this.setAudioConnected(false);

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