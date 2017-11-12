import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface MessagesProps {
    visible: boolean;
}

export interface MessagesState {
    open?: boolean;
}

export class Messages extends React.Component<MessagesProps, MessagesState> {

    constructor(props: MessagesProps) {
        super(props);
        this.state = {
            open: this.props.visible
        }
    }

    handleClose() {
        this.setState({ open: false });
    }
    
    componentWillReceiveProps(nextProps: MessagesProps) {
        const newState: MessagesState = {};
        if (nextProps.visible != undefined) {
            newState.open = nextProps.visible;
        }

        if (Object.keys(newState).length > 0) this.setState(newState)
    }

    render() {
        const { open } = this.state;

        if (!open) return <div />

        return <div className='messages-sidebar'>
                Sidebar of messages
            </div>
    }
}