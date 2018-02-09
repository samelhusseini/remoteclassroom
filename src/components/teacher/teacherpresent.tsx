/// <reference path="../../../localtypings/opentok-react.d.ts" />
import * as React from "react";

import "@opentok/client";
import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react';


import {
    Card,
    Menu,
    Table,
    Checkbox,
    Button,
    Icon,
    Modal,
    Form,
    Header,
    Image,
    Input,
    Grid,
    Comment,
    TextArea,
    Divider
} from 'semantic-ui-react';

declare var session: RemoteSession;

export interface TokBoxCredentials {
    apiKey: string,
    sessionId: string,
    token: string
}

export interface TeacherPresentProps {
}

export interface TeacherPresentState {
    error: OT.OTError,
    connection: string,
    publishing: boolean
}

export class TeacherPresent extends React.Component<TeacherPresentProps, TeacherPresentState> {
    private sessionEventHandlers: any;
    private publisherEventHandlers: any;
    private subscriberEventHandlers: any;
    private pubSession: any;

    private credentials: TokBoxCredentials = {
        apiKey: session.opentok_api_key,
        sessionId: session.opentok_session_id,
        token: session.opentok_token
    };

    constructor(props: TeacherPresentProps) {
        super(props);

        this.state = {
            error: null,
            connection: 'Disconnected',
            publishing: false,
        };

        this.sessionEventHandlers = {
            sessionConnected: () => {
                this.setState({connection: 'Connected'});
            },
            sessionDisconnected: () => {
                this.setState({connection: 'Disconnected'});
            },
            sessionReconnected: () => {
                this.setState({connection: 'Reconnected'});
            },
            sessionReconnecting: () => {
                this.setState({connection: 'Reconnecting'});
            },
        };
    }

    componentDidMount() {
        // this.connectSession();
    }

    toggleVideo() {
        let {publishing} = this.state;
        
        publishing = !publishing;
        
        if (!publishing) {
            this.disconnectSession();
        } else {
            this.connectSession();
        }

        this.setState({ publishing });
    }

    connectSession() {
        OT.getDevices((err, devices) => {
            const audioDevices = devices.filter(device => device.kind === 'audioInput');
            this.pubSession = OT.initSession(session.opentok_api_key, session.opentok_session_id);

            this.pubSession.connect(session.opentok_token, (error: any) => {
                if (error) {
                    console.error('>>', error);
                    return;
                }

                OT.getUserMedia({ audioSource: audioDevices[0].deviceId, videoSource: null })
                    .then(stream => {
                        const publisher1 = OT.initPublisher(document.querySelector('#teacher_publisher_audio') as HTMLElement, { 
                            width: 100,
                            height: 100,
                            publishVideo: false,
                            publishAudio: true,
                            videoSource: null,
                            audioSource: audioDevices[0].deviceId 
                        });

                        this.pubSession.publish(publisher1, (err: any) => console.error('Audio publishing error:', err));
                    });

                const publisher2 = OT.initPublisher(document.querySelector('#teacher_publisher_video') as HTMLElement, { 
                    width: 100,
                    height: 100,
                    publishVideo: true,
                    publishAudio: false,
                    videoSource: 'screen',
                    audioSource: null 
                });

                this.pubSession.publish(publisher2, (err: any) => console.error('Video publishing error:', err));
            });
        });
    }

    disconnectSession() {
        if (this.pubSession) {
            this.pubSession.off('streamCreated');
            this.pubSession.disconnect();
        }
    }

    componentWillUnmount() {
        this.disconnectSession();
    }

    render() {
        const {apiKey, sessionId, token} = this.credentials;
        const {error, connection, publishing} = this.state;

        return (
            <Card>
                <Card.Content textAlign='center'>
                    <Card.Header>
                        {publishing ?
                            <div className="presenting">
                                <div id="teacher_publisher_audio"></div>
                                <div id="teacher_publisher_video"></div>
                            </div> :
                            <Icon size='massive' color='blue' name='browser'/>
                        }
                    </Card.Header>
                    <Card.Description>
                        <h3>Present</h3>
                        Present your screen to the whole class
                        {error ? (
                            <div className="error">
                                <strong>Error:</strong> {error}
                            </div>
                        ) : null}
                        <div>Session Status: {connection}</div>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra textAlign="center">
                    <Button onClick={() => this.toggleVideo()}
                            color={publishing ? 'red' : 'green'}>{publishing ? 'End' : 'Start'} Presentation</Button>
                </Card.Content>
            </Card>
        );
    }
}