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
    presenceChannel: any;
}

export interface UsersState {
}

export class UserSelector extends React.Component<UsersProps, UsersState> {

    constructor(props: UsersProps) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const { presenceChannel } = this.props;
        let that = this;
        presenceChannel.bind('pusher:member_added', function (member: any) {
            that.forceUpdate();
        });
        presenceChannel.bind('pusher:member_removed', function (member: any) {
            that.forceUpdate();
        });
    }

    render() {
        const { users, messages, selectedUser, presenceChannel } = this.props;

        const getUnreadMessageCount = (user: RemoteUser) => {
            let unreadMessages = 0;
            messages.forEach(m => {
                if (m.student == user.studentId && m.read == false) unreadMessages++;
            })
            return unreadMessages;
        }

        const presenceIndicator = (user: RemoteUser) => {
            return (presenceChannel.members.get(user.studentId)) ? 'green' : 'grey';
        }

        return <Menu vertical inverted fluid borderless className="user-selector">
            {users.map((user) =>
                <Menu.Item active={user == selectedUser} onClick={() => this.props.onSelectedUser.call(this, user)}>
                    {getUnreadMessageCount(user) > 0 ? <Label className='white'>{getUnreadMessageCount(user)}</Label> : undefined}
                    <Label circular color={presenceIndicator(user)} className="presense-label" empty />
                    <p><Image spaced="right" avatar className='user-avatar' src={user.avatarUrl} /> {user.fullName}</p>
                </Menu.Item>
            )}
        </Menu>;
    }
}