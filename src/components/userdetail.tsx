import * as React from "react";

import {
    Segment,
    Sticky,
    Checkbox,
    Button,
    Icon,
    Modal,
    Form,
    Header,
    Image,
    Input,
    Grid,
    Comment,
    TextArea,
    Dimmer,
    Loader
} from 'semantic-ui-react';

import Util from '../utils/util';

import { Screen } from "./Screen";
import { Messages } from "./teacher/messages";

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface UserDetailProps {
    user: RemoteUser;
    isOnline: boolean;
    channel: any;
    messages: any[];
    sendMessage: (to: RemoteUser, message: string) => void;
    messagesLoaded?: boolean;
    connect: (studentId: string, callback: any) => void;
    disconnect: () => void;
    mute: () => void;
    unmute: () => void;
}

export interface UserDetailState {
    isMuted?: boolean;
}

export class UserDetail extends React.Component<UserDetailProps, UserDetailState> {

    constructor(props: UserDetailProps) {
        super(props);
        this.state = {
            isMuted: true
        }
    }

    mute() {
        this.setState({ isMuted: true });
        this.props.mute.call(this);
    }

    unmute() {
        this.setState({ isMuted: false });
        this.props.unmute.call(this);
    }

    render() {
        const { user, messages, messagesLoaded, sendMessage, connect, disconnect } = this.props;
        const { isMuted } = this.state;

        return <div className="admin-user-detail-panel">
            <Grid padded>
                <Grid.Row>
                    <Grid.Column width={11}>
                        <Screen channel={this.props.channel} studentId={this.props.user.studentId} isOnline={this.props.isOnline} connect={connect} disconnect={disconnect} />
                        {isMuted ? <Button circular large icon='unmute' onClick={this.unmute.bind(this)} /> : <Button circular large icon='mute' onClick={this.mute.bind(this)} />}
                    </Grid.Column>
                    <Grid.Column width={5} className="chat-column">
                        <Segment className="chat" basic={true}>
                            {!messagesLoaded ? <Dimmer active>
                                <Loader>Loading</Loader>
                            </Dimmer> : undefined}
                            <h3>Messages</h3>
                            <Messages messages={messages} user={user} sendMessage={sendMessage} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>;
    }
}