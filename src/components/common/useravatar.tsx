import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

export interface UserAvatarProps {
    avatarUrl?: string;
    color?: string;
    initials?: string;
    fullName?: string;
}

export interface UserAvatarState {
}

export class UserAvatar extends React.Component<UserAvatarProps, UserAvatarState> {

    constructor(props: UserAvatarProps) {
        super(props);
        this.state = {
        }
    }

    getInitials(name: string) {
        if (!name) return '';
        let names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
    
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    }

    render() {
        const { avatarUrl, color, fullName, initials } = this.props;

        if (avatarUrl) {
            return <Image spaced="right" className="user-avatar" avatar src={avatarUrl} />;
        }

        return <div className='ui avatar right spaced image user-avatar no-user-avatar' style={{ backgroundColor: color || '#512DA8' }}>
            {initials || this.getInitials(fullName)}
        </div>
    }
}