import * as React from "react";

import { Menu, Icon } from 'semantic-ui-react';

import Util from '../utils/util';

declare var session: RemoteSession;
declare var config: RemoteConfig;

export interface MainMenuProps {
    history: any;
    activeItem: string;
}

export class MainMenu extends React.Component<MainMenuProps, undefined> {

    constructor(props: MainMenuProps) {
        super(props);

        this.handleSettingsClick = this.handleSettingsClick.bind(this);
    }

    handleSettingsClick() {
        this.props.history.push('/settings');
    }

    handleClassClick() {
        const classSkype = config.classSkype || 'https://meet.lync.com/microsoft/samelh/37BHT9O9';
        window.open(classSkype);
    }

    render() {
        const { activeItem } = this.props;
        const { full_name, user_image, remote_link } = session;

        return <Menu inverted icon='labeled' className="main-menu">
            <Menu.Menu position='left'>
                <Menu.Item>
                    <img className="ui avatar image" src={user_image} style={{marginBottom: 3}} />
                    <span>{full_name}</span>
                </Menu.Item>

                <Menu.Item name='class' active={activeItem === 'class'} onClick={this.handleClassClick}>
                    <Icon name='users' />
                    Join Class
            </Menu.Item>
            </Menu.Menu>

            <Menu.Item name='settings' active={activeItem === 'settings'} onClick={this.handleSettingsClick}>
                <Icon name='settings' />
                Settings
            </Menu.Item>
        </Menu>;
    }
}