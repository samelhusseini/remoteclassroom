import * as React from "react";
import * as ReactDOM from "react-dom";

import Moment from 'react-moment';

import {
    Grid,
    Feed,
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


import { UserAvatar } from "../common/useravatar";

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

        // Mark all messages as read.
        messages.forEach(m => m.read = true);

        return <div className="teachermessages">
            <Feed>
                {messages.map((message) =>
                    message.type == "ping" && (
                        <Feed.Event>
                            <Feed.Label>
                                <UserAvatar avatarUrl={message.info.avatarUrl} color={message.info.color} initials={message.info.initials} fullName={message.info.fullName} />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Summary>
                                    <Feed.User>{message.info.fullName}</Feed.User> raised their hand
                                    <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>) ||
                    message.type == "help" && (
                        <Feed.Event>
                            <Feed.Label>
                                <UserAvatar avatarUrl={message.info.avatarUrl} color={message.info.color} initials={message.info.initials} fullName={message.info.fullName} />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Summary>
                                    <Feed.User>{message.info.fullName}</Feed.User> raised his/her hand
                                    <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                                </Feed.Summary>
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
                    message.type == "link" && (
                        <Feed.Event>
                            <Feed.Label>
                                <UserAvatar avatarUrl={message.avatarUrl} color={message.info.color} initials={message.info.initials} fullName={message.fullName} />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Summary>
                                    <Feed.User>{message.info.fullName}</Feed.User> raised their hand
                                    <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>)
                )}
            </Feed>

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