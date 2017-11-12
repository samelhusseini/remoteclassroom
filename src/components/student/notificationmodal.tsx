import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input,Grid } from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface NotificationModalProps {
    open: boolean;
    type: string;
}

export interface NotificationModalState {
    modalOpen?: boolean;
}

export class NotificationModal extends React.Component<NotificationModalProps, NotificationModalState> {

    constructor(props: NotificationModalProps) {
        super(props);
        this.state = {
            modalOpen: this.props.open
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
        const { type } = this.props;

        if (type == "link") {
            return <Modal open={modalOpen} size='tiny' >

                <Header> <Image avatar src='https://digitalsummit.com/wp-content/uploads/2017/01/bobby-singh.jpg'  /> Hi, I thought this link would be useful </Header>
                <Modal.Content>
                    <h4><a href = 'http://www.google.com'> www.google.com</a></h4>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inverted  >
                        <Icon name='remove' /> No Thanks
                    </Button>
                    <Button color='green' inverted onClick={this.handleClose.bind(this)} >
                        <Icon name='checkmark' /> Go to link
                    </Button>
                </Modal.Actions>

            </Modal>
        } else if (type == "poll") {
            return <Modal open={modalOpen} size='tiny' >
            
                            <Header> <Image avatar src='https://digitalsummit.com/wp-content/uploads/2017/01/bobby-singh.jpg'  /> How are you doing so far? </Header>
                            <Modal.Actions>
                            <Button color='red' inverted icon onClick={this.handleClose.bind(this)} >
                                <Icon name='thumbs down' color ='red' size = 'big'></Icon>
                            </Button>
                            <Button color='green' inverted icon onClick={this.handleClose.bind(this)} >
                                <Icon name='thumbs up' color ='green' size = 'big'></Icon>
                                </Button> 
                            </Modal.Actions>
            
                        </Modal>
        } else if (type == "ping") {

            return <Modal open={modalOpen} size='tiny' >
            
                            <Header> <Image avatar src='https://digitalsummit.com/wp-content/uploads/2017/01/bobby-singh.jpg'  /> Please all put your headphones on </Header>
                            <Modal.Actions>
                                <Button color='green' inverted onClick={this.handleClose.bind(this)} >
                                    <Icon name='checkmark' /> Ok, got it
                                </Button>
                            </Modal.Actions>
                        </Modal>
        } else {

            return <Modal open={modalOpen} basic size='small'>
                <Header icon='archive' content='Archive Old Messages' />
                <Modal.Content>
                    <p>Your inbox is getting full, would you like us to enable automatic archiving of old messages?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='red' inverted onClick={this.handleClose.bind(this)} >
                        <Icon name='remove' /> No
      </Button>
                    <Button color='green' inverted onClick={this.handleClose.bind(this)} >
                        <Icon name='checkmark' /> Yes
      </Button>
                </Modal.Actions>
            </Modal>
        }
    }
}