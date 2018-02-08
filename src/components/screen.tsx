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
}

export class Screen extends React.Component<ScreenProps> {
    constructor(props: ScreenProps) {
        super(props);

        this.state = {};
    }
    
    render() {
        const { opentok_session_id, opentok_token } = this.props;
        const { opentok_api_key } = session;

        console.log('student:', this.props, session);

        return <Segment className="screen">
            <OTSession
                apiKey={opentok_api_key}
                sessionId={opentok_session_id}
                token={opentok_token}
            >
                <OTStreams>
                    <OTSubscriber properties={{ width: 800, height: 600}} />
                </OTStreams>
            </OTSession>
        </Segment>;
    }
}