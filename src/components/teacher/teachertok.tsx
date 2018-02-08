/// <reference path="../../../localtypings/opentok-react.d.ts" />
import * as React from "react";

import "@opentok/client";
import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react';

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
    publishVideo: boolean
}

export class TeacherTok extends React.Component<TeacherTokProps, TeacherTokState> {
    private sessionEventHandlers: any;
    private publisherEventHandlers: any;
    private subscriberEventHandlers: any;

    private credentials: TokBoxCredentials = {
        apiKey: session.opentok_api_key,
        sessionId: session.opentok_session_id,
        token: session.opentok_token
    };

    constructor(props: TeacherTokProps) {
        super(props);

        this.state = {
            error: null,
            connection: 'Connecting',
            publishVideo: true,
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
        this.setState({publishVideo: !this.state.publishVideo});
    };

    render() {
        const {apiKey, sessionId, token} = this.credentials;
        const {error, connection, publishVideo} = this.state;
        return (
            <div>
                <div>Session Status: {connection}</div>
                {error ? (
                    <div className="error">
                        <strong>Error:</strong> {error}
                    </div>
                ) : null}
                <OTSession
                    apiKey={apiKey}
                    sessionId={sessionId}
                    token={token}
                    onError={this.onSessionError}
                    eventHandlers={this.sessionEventHandlers}
                >
                    <button onClick={this.toggleVideo}>
                        {publishVideo ? 'Disable' : 'Enable'} Video
                    </button>
                    <h2>Publisher</h2>
                    <OTPublisher
                        properties={{publishVideo, width: 100, height: 100, videoSource: 'screen'}}
                        onPublish={this.onPublish}
                        onError={this.onPublishError}
                        eventHandlers={this.publisherEventHandlers}
                    />

                    <h2>Subscriber</h2>
                    <OTStreams>
                        <OTSubscriber
                            properties={{width: 200, height: 200}}
                            onSubscribe={this.onSubscribe}
                            onError={this.onSubscribeError}
                            eventHandlers={this.subscriberEventHandlers}
                        />
                    </OTStreams>
                </OTSession>
            </div>
        );
    }
}