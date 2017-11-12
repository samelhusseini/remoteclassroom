import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea, Card } from 'semantic-ui-react';

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

    handleClose() {
        this.setState({ open: false });
    }

    render() {
        return <div className='messages-sidebar'>

            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Header>Messages</Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <div className="user-selector">
            </div>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Comment.Group>
                            <Comment>
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    <Comment.Metadata>
                                        <div>5:42PM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>
                                        <Card color='orange'>
                                            <Card.Content><a href = 'http://www.google.com'> www.google.com</a></Card.Content>
                                        </Card>
                                    </Comment.Text>
                                </Comment.Content>
                            </Comment>
                            <Comment>
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    <Comment.Metadata>
                                        <div>5:42PM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>How artistic!</Comment.Text>
                                </Comment.Content>
                            </Comment>
                            <Comment>
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    <Comment.Metadata>
                                        <div>5:42PM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>
                                        <Card color='blue'>
                                            <Card.Content>The class will start in 5 minutes</Card.Content>
                                        </Card>
                                    </Comment.Text>
                                </Comment.Content>
                            </Comment>
                            <Comment>
                                <Comment.Content>
                                    <Comment.Author as='a'>Kat</Comment.Author>
                                    <Comment.Metadata>
                                        <div>5:42PM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>That is incredible, you should do stuff like that more often.</Comment.Text>
                                </Comment.Content>
                            </Comment>
                        </Comment.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Form>
                            <Form.Group>
                                <Form.TextArea autoHeight placeholder='Enter Message here' rows={1} />
                                <Form.Button primary>Send</Form.Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>

                </Grid.Row>

            </Grid>
        </div>
    }
}