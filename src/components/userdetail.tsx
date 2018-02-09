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
            isMuted: false
        };
    }

    toggleMute() {
        this.setState({ isMuted: !this.state.isMuted });
    }

    render() {
        const { user, messages, messagesLoaded, sendMessage, connect, disconnect } = this.props;
        const { isMuted } = this.state;

        return <div className="admin-user-detail-panel">
            <Grid padded>
                <Grid.Row>
                    <Grid.Column width={11}>
                        <Screen opentok_session_id={this.props.user.opentokSessionId} opentok_token={this.props.user.opentokToken} audioVolume={this.state.isMuted ? 0 : 100} />
                        <Button circular large icon={isMuted ? 'unmute' : 'mute'} onClick={() => this.toggleMute()} />
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