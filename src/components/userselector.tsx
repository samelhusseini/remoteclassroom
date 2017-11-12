import * as React from "react";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Menu, Label } from 'semantic-ui-react';

import Util from '../utils/util';

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface UsersProps {
    users: RemoteUser[];
    selectedUser?: RemoteUser;
    messages: any[];
    onSelectedUser: (user: RemoteUser) => void;
}

export interface UsersState {
    open: boolean;
    edit: boolean;
}

export class UserSelector extends React.Component<UsersProps, UsersState> {

    constructor(props: UsersProps) {
        super(props);
        this.state = {
            open: false,
            edit: false
        }
    }

    render() {
        const { users, messages, selectedUser } = this.props;
        const { open, edit } = this.state;

        return <Menu vertical inverted fluid borderless className="user-selector">
            {users.map((user) =>
                <Menu.Item active={user == selectedUser} onClick={() => this.props.onSelectedUser.call(this, user)}>
                    <Label className='white'>1</Label>
                    <p><Image avatar src='https://digitalsummit.com/wp-content/uploads/2017/01/bobby-singh.jpg' /> {user.fullName}</p>


                </Menu.Item>
            )}
        </Menu>;
    }
}