import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid, Comment, TextArea, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Card } from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface MessagesProps {
}

export interface MessagesState {
}

export class Messages extends React.Component<MessagesProps, MessagesState> {

    constructor(props: MessagesProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return <Grid padded>
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
                                <Comment.Text>
                                    <Card color='blue' fluid>
                                        <Card.Content>The class will start in 5 minutes</Card.Content>
                                    </Card>
                                </Comment.Text>
                            </Comment.Content>
                        </Comment>
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
                            <Comment.Avatar src='https://digitalsummit.com/wp-content/uploads/2017/01/bobby-singh.jpg' />
                            <Comment.Content>
                                <Comment.Author as='a'>Matt</Comment.Author>
                                <Comment.Metadata>
                                    <div>Today at 5:42PM</div>
                                </Comment.Metadata>
                                <Comment.Text>
                                    <Card color='orange' fluid>
                                        <Card.Content><a href = 'http://www.google.com'> www.google.com</a></Card.Content>
                                    </Card>
                                </Comment.Text>
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
    }
}