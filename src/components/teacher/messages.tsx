import * as React from "react";
import * as ReactDOM from "react-dom";

import Moment from 'react-moment';

import {
    Grid,
    Comment,
    TextArea,
    Checkbox,
    Button,
    Icon,
    Modal,
    Form,
    Header,
    Image,
    Input,
    Card
} from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface MessagesProps {
    user: RemoteUser;
    messages: any[];
    sendMessage: (to: RemoteUser, message: string) => void;
}

export interface MessagesState {
}

export class Messages extends React.Component<MessagesProps, MessagesState> {

    constructor(props: MessagesProps) {
        super(props);
        this.state = {}
    }

    handleMessageKeyPress(e: KeyboardEvent) {
        if (e.key == 'Enter' && !e.shiftKey) {
            this.handleSendMessage(e);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    handleSendMessage(e: any) {
        const { user, sendMessage } = this.props;
        const text = document.getElementById('teacherMessageText') as HTMLTextAreaElement;
        if (text && text.value) {
            sendMessage(user, text.value);
        }
        text.value = '';
    }

    render() {
        const { messages } = this.props;

        return <div className="teachermessages">
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

            <Form>
                <Form.Group>
                    <TextArea id='teacherMessageText' autoHeight placeholder='Type a message...' rows={1}
                        onKeyPress={this.handleMessageKeyPress.bind(this)} />
                    <Button primary onClick={this.handleSendMessage.bind(this)}>Send</Button>
                </Form.Group>
            </Form>
        </div>

    }
}