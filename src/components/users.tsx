import * as React from "react";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

import Util from '../utils/util';

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface UsersProps {
    users: RemoteUser[];
    channel: any;
    messages: any[];
}

export interface UsersState {
    open: boolean;
    edit: boolean;
}

export class Users extends React.Component<UsersProps, UsersState> {

    constructor(props: UsersProps) {
        super(props);
        this.state = {
            open: false,
            edit: false
        }

        this.handleImportUsers = this.handleImportUsers.bind(this);
        this.handleEditUsers = this.handleEditUsers.bind(this);
        this.handleDone = this.handleDone.bind(this);
        this.handleImportUsersDialog = this.handleImportUsersDialog.bind(this);
        this.handlePingUser = this.handlePingUser.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.close = this.close.bind(this);

        this.handlePrimaryLink = this.handlePrimaryLink.bind(this);
        this.handleSecondaryLink = this.handleSecondaryLink.bind(this);

        this.handlePrimaryLinkChanged = this.handlePrimaryLinkChanged.bind(this);
        this.handleSecondaryLinkChanged = this.handleSecondaryLinkChanged.bind(this);

        this.updatePrimaryLink = Util.debounce(this.updatePrimaryLink, 1000);
        this.updateSecondaryLink = Util.debounce(this.updateSecondaryLink, 1000);
    }

    handleImportUsers(e: React.MouseEvent<any>) {
        this.setState({ open: true });
    }

    handleEditUsers(e: React.MouseEvent<any>) {
        this.setState({ edit: true })
    }

    handleDone(e: React.MouseEvent<any>) {
        this.setState({ edit: false })
    }

    handleImportUsersDialog(e: any) {
        const token = "7~wS4LmKEJvb2dGKYVLL0cgdUMgAvAyeC6x3PcYNc8cNbAOC0fIthbXZBSjlSXUDWm";
        Util.POST('/importusers', {
            courseId: Util.getCourseId(),
            token: token
        })
        this.setState({ open: false })
    }

    handlePingUser(user: RemoteUser) {
        this.props.channel.trigger('client-ping' + Util.getCourseId(),
            {
                studentId: user.studentId
            });
    }

    handlePrimaryLinkChanged(user: RemoteUser, data: any) {
        this.updatePrimaryLink(user, data.value);
    }

    updatePrimaryLink(user: RemoteUser, value: string) {
        Util.POST('/update_primary', {
            courseId: Util.getCourseId(),
            studentId: user.studentId,
            primaryLink: value
        })
    }

    handleSecondaryLinkChanged(user: RemoteUser, data: any) {
        this.updateSecondaryLink(user, data.value);
    }

    updateSecondaryLink(user: RemoteUser, value: string) {
        Util.POST('/update_secondary', {
            courseId: Util.getCourseId(),
            studentId: user.studentId,
            secondaryLink: value
        })
    }

    handlePrimaryLink(user: RemoteUser) {
        window.open(user.primaryRemoteLink + "?sl=");
    }

    handleSecondaryLink(user: RemoteUser) {
        var url = user.secondaryRemoteLink;
        var w = (window.parent) ? window.parent : window
        w.location.assign(url);
    }

    handleDeleteUser(user: RemoteUser) {
        Util.POST('/delete_user', {
            courseId: Util.getCourseId(),
            studentId: user.studentId
        })
    }

    close() {
        this.setState({ open: false })
    }

    render() {
        const { users, messages } = this.props;
        const { open, edit } = this.state;
        /*
        const needsHelp = (user: RemoteUser) => {
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].type == "help" && messages[i].student == user.studentId) {
                    return true;
                }
            }
            return false;
        }
        let onlineStatus = {};
        users.forEach(user => {
            let onlineStat = "grey";
            messages.filter(m => m.student == user.studentId && (m.type == "loaded" || m.type == "registered"))
            .forEach(message => {
                if (m.type == "registered") onlineStat = "green";
                if (m.type == "loaded" && onlineStat != "green") onlineStat = "yellow";
            })
            onlineStatus[user] = onlineStat;
        })*/

        return <div><Table celled compact definition striped>
            {edit ?
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>Call Link</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                : undefined}
            <Table.Body>
                {users.map((user) =>
                    <Table.Row>
                        <Table.Cell collapsing>
                            <Header as='h4' image>
                                <Image src={user.avatarUrl} shape='rounded' size='mini' />
                                <Header.Content>
                                    {user.fullName}
                                    <Header.Subheader></Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        {!edit ?
                            <Table.Cell>
                                <Button floated='right' icon labelPosition='left' size='small' color='green' onClick={() => this.handlePingUser(user)}>
                                    <Icon name='spinner' /> Ping
                            </Button>
                                {user.primaryRemoteLink && (
                                    <Button floated='right' icon labelPosition='left' primary size='small' onClick={() => this.handlePrimaryLink(user)}>
                                        <Icon name='skype' /> Web
                                </Button>)}
                                {user.secondaryRemoteLink && (
                                    <Button floated='right' icon labelPosition='left' size='small' color='teal' onClick={() => this.handleSecondaryLink(user)}>
                                        <Icon name='skype' /> Direct
                                </Button>
                                )}
                            </Table.Cell>
                            :
                            <Table.Cell>
                                <Form.Group inline widths='equal'>
                                    <Form.Field control={Input} label='Primary Link' value={user.primaryRemoteLink} placeholder='Primary Link' onChange={(event: any, data: object) => this.handlePrimaryLinkChanged(user, data)} />
                                    <Form.Field control={Input} label='Secondary Link' value={user.secondaryRemoteLink} placeholder='Secondary Link' onChange={(event: any, data: object) => this.handleSecondaryLinkChanged(user, data)} />
                                    <Form.Field control={Button} onClick={() => this.handleDeleteUser(user)}>Delete</Form.Field>
                                </Form.Group>
                            </Table.Cell>
                        }
                    </Table.Row>
                )}
            </Table.Body>

            <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan='4'>
                        <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.handleImportUsers}>
                            <Icon name='user' /> Import Users
                            </Button>
                        {!edit ? <Button floated='right' icon labelPosition='left' size='small' color='green' onClick={this.handleEditUsers}>
                            <Icon name='edit' /> Edit
                            </Button> : <Button floated='right' icon labelPosition='left' size='small' color='green' onClick={this.handleDone}>
                                <Icon name='edit' /> Done
                            </Button>
                        }
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
            <Modal size={'fullscreen'} open={open} onClose={this.close}>
                <Modal.Header>
                    Imports Users from Canvas
        </Modal.Header>
                <Modal.Content>
                    <p>In order to import users from canvas, we'll need to get an access token.</p>
                    <p>Create a new access token in Canvas, and paste it below</p>
                    <Form>
                        <Form.Field>
                            <input placeholder='Access Token' />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary icon='checkmark' labelPosition='right' content='Import' onClick={this.handleImportUsersDialog} />
                </Modal.Actions>
            </Modal>
        </div >;
    }
}