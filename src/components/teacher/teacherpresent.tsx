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