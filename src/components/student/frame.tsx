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
    audioDeviceId?: string;
    teacherSharing: boolean;
}

export class Frame extends React.Component<FrameProps, FrameState> {
    constructor(props: FrameProps) {
        super(props);

        this.state = {
            audioDeviceId: null,
            teacherSharing: false
        };

        OT.getDevices((err, devices) => {
            const audioDevices = devices.filter(device => device.kind === 'audioInput');

            OT.getUserMedia({ audioSource: audioDevices[0].deviceId, videoSource: null });

            this.setState({ audioDeviceId: audioDevices[0].deviceId });
        });
    }

    render() {
        const { url } = this.props;
        const { audioDeviceId, teacherSharing } = this.state;

        return <div className="student-view">
            {
                teacherSharing ?
                    <div>TEACHER IS SHARING</div> :
                    null
            }

            <OTSession apiKey={session.opentok_api_key} sessionId={session.opentok_teacher_session_id} token={session.opentok_teacher_token}>
                <OTStreams>
                    <OTSubscriber properties={
                        { 
                            width: 800,
                            height: 600,
                            subscribeToAudio: true,
                            subscribeToVideo: true,
                            audioVolume: 100
                        }
                    }
                    eventHandlers={
                        {
                            videoEnabled: () => this.setState({ teacherSharing: true }),
                            videoDisabled: () => this.setState({ teacherSharing: false })
                        }
                    }
                    />
                </OTStreams>
            </OTSession>

            <OTSession apiKey={session.opentok_api_key} sessionId={session.opentok_session_id} token={session.opentok_token}>
                <OTPublisher properties={{ publishVideo: true, publishAudio: true, width: 100, height: 100, videoSource: 'screen', audioSource: audioDeviceId }} />
                
                <iframe id="content-iframe" src={url} sandbox="allow-top-navigation allow-scripts allow-same-origin"></iframe>
            </OTSession>
        </div>;
    }
}