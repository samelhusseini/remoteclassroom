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
    audioDeviceId?: string;
    teacherSharing: boolean;
}

export class Frame extends React.Component<FrameProps, FrameState> {
    private subscriberEventHandlers: any;
    private onSubscribe: (event: any) => any;

    constructor(props: FrameProps) {
        super(props);

        this.state = {
            audioDeviceId: null,
            teacherSharing: false
        };

        OT.getUserMedia({
            videoSource: null
        }).then((micStream) => {
            console.log('getUserMedia fulfilled')
            this.setState({audioDeviceId: micStream.getAudioTracks()[0]})
        });

        // OT.getDevices((err, devices) => {
        //     const audioDevices = devices.filter(device => device.kind === 'audioInput');
        //
        //     OT.getUserMedia({ audioSource: audioDevices[0].deviceId, videoSource: null });
        //
        //     this.setState({ audioDeviceId: audioDevices[0].deviceId });
        // });

        this.subscriberEventHandlers = {
            destroyed: (event: any) => {
                this.setState({teacherSharing: false})
            }
        };
        this.onSubscribe = (event: any) => {
            this.setState({teacherSharing: true})
        }
    }

    render() {
        const {url} = this.props;
        const {audioDeviceId, teacherSharing} = this.state;

        return <div className="student-view">
            <div className="student-publisher">
                <OTSession apiKey={session.opentok_api_key} sessionId={session.opentok_session_id}
                           token={session.opentok_token}>
                    {audioDeviceId ?
                        <OTPublisher properties={{
                            publishVideo: true,
                            publishAudio: true,
                            width: 100,
                            height: 100,
                            videoSource: 'screen',
                            audioSource: audioDeviceId
                        }}/>
                        : null}
                </OTSession>
            </div>
            <div className="student-subscriber">
                <OTSession apiKey={session.opentok_api_key} sessionId={session.opentok_teacher_session_id}
                           token={session.opentok_teacher_token}>
                    <OTStreams>
                        <OTSubscriber properties={{
                            width: "100%",
                            height: "100%",
                            subscribeToAudio: true,
                            subscribeToVideo: true,
                            audioVolume: 100
                        }}
                                      eventHandlers={this.subscriberEventHandlers}
                                      onSubscribe={this.onSubscribe}
                        />
                    </OTStreams>
                </OTSession>
            </div>
            {teacherSharing ? null :
                <iframe id="content-iframe" src={url}
                        sandbox="allow-top-navigation allow-scripts allow-same-origin"></iframe>
            }
        </div>;
    }
}