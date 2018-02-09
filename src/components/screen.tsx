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
}

export class Screen extends React.Component<ScreenProps> {
    otSession: any;

    constructor(props: ScreenProps) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        const { opentok_session_id, opentok_token } = this.props;
        const { opentok_api_key } = session;

        this.otSession = OT.initSession(opentok_api_key, opentok_session_id);

        this.otSession.on('streamCreated', (event: any) => {
            let props: any = {
                insertMode: 'append',
                width: 100,
                height: 100
            };

            if (event.stream.hasVideo) {
                props.width = 800;
                props.height = 600;
                props.insertMode = 'before';
            }

            this.otSession.subscribe(event.stream, 'subscriber', props, (err: any) => console.error('<<<', err));
        });

        this.otSession.connect(opentok_token, (error: any) => {
            if (error) {
                console.error('>>', error);
                return;
            }
        });
    }

    componentWillUnmount() {
        this.otSession.off('streamCreated');
        this.otSession.disconnect();
    }
    
    render() {
        const { opentok_session_id, opentok_token } = this.props;
        const { opentok_api_key } = session;

        return <Segment className="screen">
            <div id="subscriber"></div>
        </Segment>;
    }
}