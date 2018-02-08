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

export interface TeacherTokProps {
}

export interface TeacherTokState {
    error: OT.OTError,
    connection: string,
    publishing: boolean
}

export class TeacherTok extends React.Component<TeacherTokProps, TeacherTokState> {
    private sessionEventHandlers: any;
    private publisherEventHandlers: any;
    private subscriberEventHandlers: any;

    private credentials: TokBoxCredentials = {
        apiKey: session.opentok_api_key, // "46055162",
        sessionId: session.opentok_session_id, // "2_MX40NjA1NTE2Mn5-MTUxODA1MDQwNzM5M35QdTl1OVVCTmN0b3l1ekR3T3BZY3hFSGV-fg",
        token: session.opentok_token // "T1==cGFydG5lcl9pZD00NjA1NTE2MiZzaWc9M2E2ODY3ZDlhMmRmMGEzZjhiZDJlMmMxZDdlNWU2N2I5Y2VjMGNmMDpzZXNzaW9uX2lkPTJfTVg0ME5qQTFOVEUyTW41LU1UVXhPREExTURRd056TTVNMzVRZFRsMU9WVkNUbU4wYjNsMWVrUjNUM0JaWTNoRlNHVi1mZyZjcmVhdGVfdGltZT0xNTE4MDUwNTc0Jm5vbmNlPTAuOTg3MTg2MjczNzYyNjA3NCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTE4NjU1MzczJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9"

    };

    constructor(props: TeacherTokProps) {
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

        this.publisherEventHandlers = {
            accessDenied: () => {
                console.log('User denied access to media source');
            },
            streamCreated: () => {
                console.log('Publisher stream created');
            },
            streamDestroyed: ({reason}: { reason: string }) => {
                console.log(`Publisher stream destroyed because: ${reason}`);
            },
        };

        this.subscriberEventHandlers = {
            videoEnabled: () => {
                console.log('Subscriber video enabled');
            },
            videoDisabled: () => {
                console.log('Subscriber video disabled');
            },
        };
    }

    onSessionError = (error: OT.OTError) => {
        this.setState({error});
    };

    onPublish = () => {
        console.log('Publish Success');
    };

    onPublishError = (error: OT.OTError) => {
        this.setState({error});
    };

    onSubscribe = () => {
        console.log('Subscribe Success');
    };

    onSubscribeError = (error: OT.OTError) => {
        this.setState({error});
    };

    toggleVideo = () => {
        this.setState({publishing: !this.state.publishing});
    };

    render() {
        const {apiKey, sessionId, token} = this.credentials;
        const {error, connection, publishing} = this.state;

        return (
            <Card>
                <Card.Content textAlign='center'>
                    <Card.Header>

                        <OTSession
                            apiKey={apiKey}
                            sessionId={sessionId}
                            token={token}
                            onError={this.onSessionError}
                            eventHandlers={this.sessionEventHandlers}
                        >
                            {publishing ?
                                <OTPublisher
                                    properties={{
                                        publishVideo: true,
                                        publishAudio: true,
                                        width: 262,
                                        height: 164,
                                        videoSource: 'screen'
                                    }}
                                    onPublish={this.onPublish}
                                    onError={this.onPublishError}
                                    eventHandlers={this.publisherEventHandlers}
                                /> :
                                <Icon size='massive' color='blue' name='browser'/>
                            }

                        </OTSession>
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
                    <Button onClick={this.toggleVideo}
                            color={publishing ? 'red' : 'green'}>{publishing ? 'End' : 'Start'} Presentation</Button>
                </Card.Content>
            </Card>
        );
    }
}