import * as React from "react";
import * as ReactDOM from "react-dom";

import Moment from 'react-moment';

import { Grid, Comment, TextArea, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Card } from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface MessagesProps {
    user: RemoteUser;
    messages: any[];
}

export interface MessagesState {
}

export class Messages extends React.Component<MessagesProps, MessagesState> {

    constructor(props: MessagesProps) {
        super(props);
        this.state = {
        }
    }

    handleMessageKeyPress(e: KeyboardEvent) {
        if (e.key == 'Enter') {
            this.handleSendMessage(e);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    handleSendMessage(e: any) {
        const {user} = this.props;
        const text = document.getElementById('teacherMessageText') as HTMLTextAreaElement;
        if (text && text.value) {
            Util.POST('/new_teacher_message', {
                studentId: user.studentId,
                teacherId: 'asdasdasda', //Util.getStudentId(),
                courseId: Util.getCourseId(),
                text: text.value
            });
        }
        text.value = '';
    }

    render() {
        const { messages } = this.props;

        return <Grid padded>
            <Grid.Row>
                <Grid.Column width={10}>
                    <Comment.Group>
                        {messages.map((message) =>
                            message.type == "ping" && (
                                <Comment>
                                    <Comment.Avatar src={message.avatarUrl} />
                                    <Comment.Content>
                                        <Comment.Author as='a'>{message.fullName}</Comment.Author>
                                        <Comment.Metadata>
                                            <div><Moment fromNow utc>{message.date}</Moment></div>
                                        </Comment.Metadata>
                                        <Comment.Text>
                                            <Card color='blue' fluid>
                                                <Card.Content></Card.Content>
                                            </Card>
                                        </Comment.Text>
                                    </Comment.Content>
                                </Comment>) ||
                            message.type == "text" && (
                                <Comment>
                                    <Comment.Avatar src={message.avatarUrl} />
                                    <Comment.Content>
                                        <Comment.Author as='a'>{message.fullName}</Comment.Author>
                                        <Comment.Metadata>
                                            <div><Moment fromNow utc>{message.date}</Moment></div>
                                        </Comment.Metadata>
                                        <Comment.Text>{message.content}</Comment.Text>
                                    </Comment.Content>
                                </Comment>) ||
                            message.type == "link" && (
                                <Comment>
                                    <Comment.Avatar src={message.avatarUrl} />
                                    <Comment.Content>
                                        <Comment.Author as='a'>{message.fullName}</Comment.Author>
                                        <Comment.Metadata>
                                            <div><Moment fromNow utc>{message.date}</Moment></div>
                                        </Comment.Metadata>
                                        <Comment.Text>
                                            <Card color='orange' fluid>
                                                <Card.Content><a href='http://www.google.com'> www.google.com</a></Card.Content>
                                            </Card>
                                        </Comment.Text>
                                    </Comment.Content>
                                </Comment>)
                        )}
                    </Comment.Group>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={9}>
                    <Form>
                        <TextArea id='teacherMessageText' autoHeight placeholder='Type a message...' rows={1} onKeyPress={this.handleMessageKeyPress.bind(this)} />
                    </Form>
                </Grid.Column>
                <Grid.Column width={1}>
                    <Button primary onClick={this.handleSendMessage.bind(this)}>Send</Button>
                </Grid.Column>
            </Grid.Row>

        </Grid>
    }
}