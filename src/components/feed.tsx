import * as React from "react";
import Moment from 'react-moment';

import { Feed, Icon } from 'semantic-ui-react';

export interface StatusFeedProps {
    messages: any[];
}

export class StatusFeed extends React.Component<StatusFeedProps, undefined> {
    render() {
        const { messages } = this.props;

        return <Feed>
            {messages.map((message) =>
                message.type == "help" && (
                    <Feed.Event>
                        <Feed.Label>
                            <img src={message.avatarUrl} />
                        </Feed.Label>
                        <Feed.Content>
                            <Feed.Summary>
                                <Feed.User>{message.fullName}</Feed.User> asked for help
                            <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                            </Feed.Summary>
                            <Feed.Meta>
                            </Feed.Meta>
                        </Feed.Content>
                    </Feed.Event>
                ) ||
                message.type == "registered" && (
                    <Feed.Event>
                        <Feed.Label>
                            <img src={message.avatarUrl} />
                        </Feed.Label>
                        <Feed.Content>
                            <Feed.Summary>
                                <Feed.User>{message.fullName}</Feed.User> is on the call
                                <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                            </Feed.Summary>
                            <Feed.Meta>
                            </Feed.Meta>
                        </Feed.Content>
                    </Feed.Event>
                ) ||
                message.type == "loaded" && (
                    <Feed.Event>
                        <Feed.Label>
                            <img src={message.avatarUrl} />
                        </Feed.Label>
                        <Feed.Content>
                            <Feed.Summary>
                                <Feed.User>{message.fullName}</Feed.User> launched Remote Class
                                <Feed.Date><Moment fromNow utc>{message.date}</Moment></Feed.Date>
                            </Feed.Summary>
                            <Feed.Meta>
                            </Feed.Meta>
                        </Feed.Content>
                    </Feed.Event>
                )
            )}
        </Feed>;
    }
}