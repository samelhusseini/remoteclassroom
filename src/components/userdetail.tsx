import * as React from "react";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea} from 'semantic-ui-react';

import Util from '../utils/util';

import { Screen } from "./Screen";
import { Messages } from "./teacher/messages";

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface UserDetailProps {
    user: RemoteUser;
    channel: any;
    messages: any[];
}

export interface UserDetailState {
}

export class UserDetail extends React.Component<UserDetailProps, UserDetailState> {

    constructor(props: UserDetailProps) {
        super(props);
        this.state = {
            messages: this.props.messages || []
        }
    }

    render() {
        const { user, messages } = this.props;

        if (!user) return <div />; // No user selected

        return <div className="admin-user-detail-panel">
            <Grid padded>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <h1>{user.fullName}</h1>
                        <Screen channel={this.props.channel} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8} textAlign='center'>
                        <h4> Voice Chat:
                        <Button.Group size='small'>
                                <Button>On</Button>
                                <Button.Or />
                                <Button negative>Off</Button>
                            </Button.Group>
                        </h4>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <div className="user-selector">
            </div>

            <Messages messages={messages} user={user}/>
        </div >;
    }
}