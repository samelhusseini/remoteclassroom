import * as React from "react";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea} from 'semantic-ui-react';

import Util from '../utils/util';

import { Screen } from "./Screen";

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface UserDetailProps {
    user: RemoteUser;
    channel: any;
    messages: any[];
}

export interface UserDetailState {
    open: boolean;
    edit: boolean;
}

export class UserDetail extends React.Component<UserDetailProps, UserDetailState> {

    constructor(props: UserDetailProps) {
        super(props);
        this.state = {
            open: false,
            edit: false
        }
    }

    render() {
        const { user, messages } = this.props;
        const { open, edit } = this.state;

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

            <Grid padded>
                <Grid.Row>
                    <Grid.Column width={10}>
                    <Comment.Group>
                        <Comment>
                            <Comment.Avatar src='https://digitalsummit.com/wp-content/uploads/2017/01/bobby-singh.jpg' />
                            <Comment.Content>
                                <Comment.Author as='a'>Matt</Comment.Author>
                                <Comment.Metadata>
                                    <div>Today at 5:42PM</div>
                                </Comment.Metadata>
                                <Comment.Text>How artistic!</Comment.Text>
                            </Comment.Content>
                        </Comment>
                        <Comment>
                            <Comment.Avatar src='https://pre00.deviantart.net/1031/th/pre/i/2012/311/7/1/longhaired_girl__profile_by_alexandrinnne-d5ka9it.jpg' />
                            <Comment.Content>
                                <Comment.Author as='a'>Kat</Comment.Author>
                                <Comment.Metadata>
                                    <div>Today at 5:42PM</div>
                                </Comment.Metadata>
                                <Comment.Text>That is incredible, you should do stuff like that more often.</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    </Comment.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={9}>
                        <Form>
                            <TextArea autoHeight placeholder='Enter your Message here' rows={1} />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={1}>
                        <Button primary>Send</Button>
                    </Grid.Column>
                </Grid.Row>

            </Grid>
            
        </div >;
    }
}