import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SimpleWebRTC from 'simplewebrtc';

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Segment, Loader, Dimmer } from 'semantic-ui-react';

import Util from '../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface ScreenProps {
    channel: any;
    studentId: string;
    isOnline: boolean;
    connect: (studentId: string, callback: any) => void;
    disconnect: () => void;
}

export interface ScreenState {
    connecting: boolean;
    isReady: boolean;
}

export class Screen extends React.Component<ScreenProps, ScreenState> {

    private screenContainer: HTMLElement;

    constructor(props: ScreenProps) {
        super(props);
        this.state = {
            connecting: true,
            isReady: false
        }
    }

    componentWillMount() {
        const { studentId, isOnline } = this.props;
        if (studentId && isOnline) this.connect(studentId);
    }

    componentWillUnmount() {
        this.disconnect();
    }

    componentWillReceiveProps(nextProps: ScreenProps) {
        if (this.props.studentId != nextProps.studentId) {
            const { studentId, isOnline } = nextProps;
            // Disconnect from previous channel, and connect to a new one
            if (this.props.studentId) {
                this.disconnect();
            }

            if (isOnline) {
                this.connect(studentId);
            }
        }
    }

    connect(studentId: string) {
        const { isReady } = this.state;
        const { connect } = this.props;

        this.setState({connecting: true});

        const connectedCallback = () => {
            this.setState({connecting: false});
        };

        connect.call(this, studentId, connectedCallback);
    }

    disconnect() {
        const { disconnect } = this.props;
        disconnect.call(this);
    }
    
    render() {
        const { isOnline } = this.props;
        const { connecting } = this.state;

        return <Segment className="screen">
            {!isOnline ? 
            <div className="status">
                <div className="content">
                    <div className="center">
                        <Icon name="hide" />
                        <div>Student is Offline</div>
                    </div>
            </div> </div> : undefined}
            {connecting && isOnline ? <Dimmer active>
                <Loader>Loading</Loader>
            </Dimmer> : undefined}

            <div id="localVideo"></div>
            <div id="localVolume"></div>
            <div id="remotes"></div>
            <div id="localScreenContainer"
                ref={e => this.screenContainer = e}>
            </div>
        </Segment>;
    }
}