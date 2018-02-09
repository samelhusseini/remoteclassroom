import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

import Util from '../../utils/util';

import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

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
    constructor(props: FrameProps) {
        super(props);

        this.state = {
            audioSource: null,
            teacherSharing: false
        };

        // Promise
        //     .all([
        //         OT.getUserMedia({ videoSource: 'screen' }),
        //         OT.getUserMedia({ videoSource: null })
        //     ])
        //     .then(([screenStream, audioStream]) => this.setState({ videoSource: screenStream.getVideoTracks()[0], audioSource: audioStream.getAudioTracks()[0] }));
    }

    componentDidMount() {
        OT.getDevices((err, devices) => {
            const audioDevices = devices.filter(device => device.kind === 'audioInput');

            const otSession = OT.initSession(session.opentok_api_key, session.opentok_session_id);

            otSession.connect(session.opentok_token, (error: any) => {
                if (error) {
                    console.error('>>', error);
                    return;
                }

                OT.getUserMedia({ audioSource: audioDevices[0].deviceId, videoSource: null })
                    .then(stream => {
                        const publisher1 = OT.initPublisher('publisherElement1', { width: 100, height: 100, publishVideo: false, publishAudio: true, videoSource: null, audioSource: audioDevices[0].deviceId });
                        otSession.publish(publisher1, (err: any) => console.error('>>>1', err));
                    });
                
                const publisher2 = OT.initPublisher('publisherElement2', { width: 100, height: 100, publishVideo: true, publishAudio: false, videoSource: 'screen', audioSource: null });
                otSession.publish(publisher2, (err: any) => console.error('>>>2', err));
            });
        });
    }

    render() {
        const { url } = this.props;
        const { videoSource, audioSource, teacherSharing } = this.state;

        return <div className="student-view">
                <div id="publisherElement1"></div>        
                <div id="publisherElement2"></div>        
                <iframe id="content-iframe" src={url} sandbox="allow-top-navigation allow-scripts allow-same-origin"></iframe>
        </div>;
    }
}