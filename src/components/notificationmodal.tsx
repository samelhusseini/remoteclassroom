import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

import Util from '../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface NotificationModalProps {
    open?: boolean;
}

export interface NotificationModalState {
    modalOpen?: boolean;
}

export class NotificationModal extends React.Component<NotificationModalProps, NotificationModalState> {

    constructor(props: NotificationModalProps) {
        super(props);
        this.state = {
            modalOpen: false
        }
    }

    handleClose() {
        this.setState({ modalOpen: false });
    }
    
    componentWillReceiveProps(nextProps: NotificationModalProps) {
        const newState: NotificationModalState = {};
        if (nextProps.open != undefined) {
            newState.modalOpen = nextProps.open;
        }

        if (Object.keys(newState).length > 0) this.setState(newState)
    }

    render() {
        const { modalOpen } = this.state;

        return <Modal open={modalOpen} basic size='small'>
            <Header icon='archive' content='Archive Old Messages' />
            <Modal.Content>
                <p>Your inbox is getting full, would you like us to enable automatic archiving of old messages?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button basic color='red' inverted onClick={this.handleClose} >
                    <Icon name='remove' /> No
          </Button>
                <Button color='green' inverted onClick={this.handleClose} >
                    <Icon name='checkmark' /> Yes
          </Button>
            </Modal.Actions>
        </Modal>
    }
}