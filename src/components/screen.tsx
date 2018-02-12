import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Segment, Loader, Dimmer } from 'semantic-ui-react';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

import Util from '../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface ScreenProps {
    opentok_session_id: string;
    opentok_token: string;
    audioVolume: number;
    publishAudio: boolean;
}

export class Screen extends React.Component<ScreenProps> {
    otSession: any;

    private audioPublisher: any;

    constructor(props: ScreenProps) {
        super(props);
    }

    componentWillReceiveProps(nextProps: ScreenProps) {
        if (nextProps.publishAudio != undefined) {
            this.publishAudio(nextProps.publishAudio);
        }
        if (this.props.opentok_session_id != nextProps.opentok_session_id
            || this.props.opentok_token != nextProps.opentok_token) {
            this.disconnectSession();
            this.connectSession(nextProps.opentok_session_id, nextProps.opentok_token);
        }
    }

    publishAudio(publish: boolean) {
        if (this.audioPublisher) this.audioPublisher.publishAudio(publish);
    }

    connectSession(opentok_session_id: string, opentok_token: string) {
        const { opentok_api_key } = session;

        this.otSession = OT.initSession(opentok_api_key, opentok_session_id);

        OT.getDevices((err, devices) => {
            const audioDevices = devices.filter(device => device.kind === 'audioInput');

            this.otSession.on('streamCreated', (event: any) => {
                let props: any = {
                    insertMode: 'append',
                    width: 100,
                    height: 100
                };

                if (event.stream.hasVideo) {
                    props.width = "100%";
                    props.height = "100%";
                    props.insertMode = 'before';
                }

                this.otSession.subscribe(event.stream, 'subscriber', props, (err: any) => {
                    if (err) console.error('<<<', err)
                });
            });

            this.otSession.connect(opentok_token, (error: any) => {
                if (error) {
                    console.error('>>', error);
                    return;
                }

                // Stream teacher audio to single student
                OT.getUserMedia({ audioSource: audioDevices[0].deviceId, videoSource: null })
                    .then(stream => {
                        console.log('setting up audio for 1:1 student');
                        this.audioPublisher = OT.initPublisher(undefined, {
                            publishAudio: true,
                            publishVideo: false,
                            videoSource: null,
                            audioSource: audioDevices[0].deviceId,
                            insertDefaultUI: false
                        });

                        this.audioPublisher.publishAudio(this.props.publishAudio);

                        this.audioPublisher.on('videoElementCreated', (event: any) => {
                            console.log(event.element);
                            //(document.querySelector('#teacher_publisher_audio') as HTMLElement).appendChild(event.element);
                        })

                        this.otSession.publish(this.audioPublisher, (err: any) => {
                            if (err) console.error('Audio publishing error:', err)
                        });
                    });
            });
        });
    }

    disconnectSession() {
        if (this.otSession) {
            this.otSession.off('streamCreated');
            this.otSession.disconnect();
        }
    }

    componentDidMount() {
        const { opentok_session_id, opentok_token } = this.props;
        this.disconnectSession();
        this.connectSession(opentok_session_id, opentok_token);

        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    }

    componentWillUnmount() {
        this.disconnectSession();

        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        var w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

        let publisherContainer = document.getElementById("screen");
        publisherContainer.style.width = `${width-600}px`;
        publisherContainer.style.height = `${height}px`;
    }

    render() {
        const { opentok_session_id, opentok_token } = this.props;
        const { opentok_api_key } = session;

        return <Segment id="screen" className="screen">
            <div id="subscriber"></div>
        </Segment>;
    }
}