import * as React from "react";
import * as ReactDOM from "react-dom";

import Moment from 'react-moment';

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea, Card } from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface MessagesProps {
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
        const text = document.getElementById('studentMessageText') as HTMLTextAreaElement;
        if (text && text.value) {
            Util.POST('/new_student_message', {
                studentId: Util.getStudentId(),
                courseId: Util.getCourseId(),
                text: text.value
            });
        }
        text.value = '';
        let that = this;
        setTimeout(function () {
            that.scrollToBottom();
        }, 500);
    }

    scrollToBottom() {
        let objDiv = document.getElementById("scrolling-messages");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    render() {
        const { messages } = this.props;

        return <div className='messages-sidebar'>

            <Header>Messages</Header>
            <div id="scrolling-messages" className="scrolling-messages">
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Comment.Group>
                                {messages.map((message) =>
                                    message.type == "link" && (
                                        <Comment>
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
                                        </Comment>) ||
                                    message.type == "text" && (
                                        <Comment>
                                            <Comment.Content>
                                                <Comment.Author as='a'>{message.fullName}</Comment.Author>
                                                <Comment.Metadata>
                                                    <div><Moment fromNow utc>{message.date}</Moment></div>
                                                </Comment.Metadata>
                                                <Comment.Text>{message.content}</Comment.Text>
                                            </Comment.Content>
                                        </Comment>) ||
                                    message.type == "ping" && (
                                        <Comment>
                                            <Comment.Content>
                                                <Comment.Author as='a'>{message.fullName}</Comment.Author>
                                                <Comment.Metadata>
                                                    <div><Moment fromNow utc>{message.date}</Moment></div>
                                                </Comment.Metadata>
                                                <Comment.Text>
                                                    <Card color='blue' fluid>
                                                        <Card.Content>The class will start in 5 minutes</Card.Content>
                                                    </Card>
                                                </Comment.Text>
                                            </Comment.Content>
                                        </Comment>)
                                )}
                            </Comment.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
            <div className="sidebar-footer">
                <Grid padded>
                    <Form>
                        <Form.Group>
                            <Form.TextArea id='studentMessageText' autoHeight placeholder='Type a message...' rows={1} onKeyPress={this.handleMessageKeyPress.bind(this)} />
                            {false ? <Form.Button primary onClick={this.handleSendMessage.bind(this)}>Send</Form.Button> : undefined}
                        </Form.Group>
                    </Form>
                </Grid>
            </div>
        </div>
    }
}