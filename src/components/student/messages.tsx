import * as React from "react";
import * as ReactDOM from "react-dom";

import Moment from 'react-moment';

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Grid, Feed, TextArea, Card } from 'semantic-ui-react';

import Util from '../../utils/util';

import { UserAvatar } from "../common/useravatar";

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
        if (e.key == 'Enter' && !e.shiftKey) {
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
                            <Feed>
                                {messages.map((message) =>
                                    message.type == "link" && (
                                        <Feed.Event>
                                            <Feed.Label>
                                                <UserAvatar avatarUrl={message.info.avatarUrl} color={message.info.color} initials={message.info.initials} fullName={message.info.fullName} />
                                            </Feed.Label>
                                            <Feed.Content>
                                                <Feed.Summary>
                                                    <Feed.User>{message.info.fullName}</Feed.User>
                                                    <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                                                </Feed.Summary>
                                                <Feed.Extra text>
                                                    Go to this link: {message.content}
                                                </Feed.Extra>
                                            </Feed.Content>
                                        </Feed.Event>) ||
                                    message.type == "text" && (
                                        <Feed.Event>
                                            <Feed.Label>
                                                <UserAvatar avatarUrl={message.info.avatarUrl} color={message.info.color} initials={message.info.initials} fullName={message.info.fullName} />
                                            </Feed.Label>
                                            <Feed.Content>
                                                <Feed.Summary>
                                                    <Feed.User>{message.info.fullName}</Feed.User>
                                                    <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                                                </Feed.Summary>
                                                <Feed.Extra text>
                                                    {message.content}
                                                </Feed.Extra>
                                            </Feed.Content>
                                        </Feed.Event>) ||
                                    message.type == "ping" && (
                                        <Feed.Event>
                                            <Feed.Label>
                                                <UserAvatar avatarUrl={message.info.avatarUrl} color={message.info.color} initials={message.info.initials} fullName={message.info.fullName} />
                                            </Feed.Label>
                                            <Feed.Content>
                                                <Feed.Summary>
                                                    <Feed.User>{message.info.fullName}</Feed.User>
                                                    <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                                                </Feed.Summary>
                                                <Feed.Extra text>
                                                    The class will start in 5 minutes
                                                </Feed.Extra>
                                            </Feed.Content>
                                        </Feed.Event>)
                                )}
                            </Feed>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
            <div className="sidebar-footer">
                <Grid padded>
                    <Form>
                        <Form.Group>
                            <Form.TextArea id='studentMessageText' autoHeight placeholder='Type a message...' rows={1} onKeyPress={this.handleMessageKeyPress.bind(this)} />
                            <Form.Button primary onClick={this.handleSendMessage.bind(this)}>Send</Form.Button>
                        </Form.Group>
                    </Form>
                </Grid>
            </div>
        </div>
    }
}