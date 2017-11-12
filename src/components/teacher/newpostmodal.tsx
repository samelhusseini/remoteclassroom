import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Card, Input } from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface NewPostModalProps {
    trigger: any;
}

export interface NewPostModalState {
}

export class NewPostModal extends React.Component<NewPostModalProps, NewPostModalState> {

    constructor(props: NewPostModalProps) {
        super(props);
        this.state = {
        }
    }

    handleClose() {
        this.setState({ modalOpen: false });
    }

    render() {

        return <Modal trigger={this.props.trigger} size='fullscreen' closeIcon={true}>
            <Header icon='add' content='New Blast' />
            <Modal.Content>


                <Card.Group itemsPerRow='3'>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Steve Sanders
        </Card.Header>
                            <Card.Meta>
                                Friends of Elliot
        </Card.Meta>
                            <Card.Description>
                                Steve wants to add you to the group <strong>best friends</strong>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green'>Approve</Button>
                                <Button basic color='red'>Decline</Button>
                            </div>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/molly.png' />
                            <Card.Header>
                                Molly Thomas
        </Card.Header>
                            <Card.Meta>
                                New User
        </Card.Meta>
                            <Card.Description>
                                Molly wants to add you to the group <strong>musicians</strong>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green'>Approve</Button>
                                <Button basic color='red'>Decline</Button>
                            </div>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/jenny.jpg' />
                            <Card.Header>
                                Jenny Lawrence
        </Card.Header>
                            <Card.Meta>
                                New User
        </Card.Meta>
                            <Card.Description>
                                Jenny requested permission to view your contact details
        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green'>Approve</Button>
                                <Button basic color='red'>Decline</Button>
                            </div>
                        </Card.Content>
                    </Card>

                </Card.Group>
            </Modal.Content>
        </Modal >
    }
}