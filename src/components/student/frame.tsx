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
    teacherVideoEnabled: boolean;
}

export class Frame extends React.Component<FrameProps, FrameState> {
    constructor(props: FrameProps) {
        super(props);

        this.state = {
            teacherVideoEnabled: false
        };
    }

    teacherVideoEnabled() {
        this.setState({ teacherVideoEnabled: true });
    }
    
    teacherVideoDisabled() {
        this.setState({ teacherVideoEnabled: false });
    }

    render() {
        const { url } = this.props;
        
        return <div className="student-view">
            <OTSession apiKey={session.opentok_api_key} sessionId={session.opentok_session_id} token={session.opentok_token}>
                <OTPublisher properties={{ publishVideo: true, width: 100, height: 100, videoSource: 'screen' }} />
                
                <iframe id="content-iframe" src={url} sandbox="allow-top-navigation allow-scripts allow-same-origin"></iframe>
            </OTSession>
        </div>;
    }
}