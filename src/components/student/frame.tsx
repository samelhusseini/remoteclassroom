import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface FrameProps {
    url?: string;
}

export interface FrameState {
}

export class Frame extends React.Component<FrameProps, FrameState> {

    constructor(props: FrameProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { url } = this.props;
        return <iframe id="content-iframe" src={url} sandbox="allow-top-navigation allow-scripts allow-same-origin"></iframe>
    }
}