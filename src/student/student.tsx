/// <reference path="../../localtypings/remoteclassroom.d.ts" />
/// <reference path="../../localtypings/simplewebrtc.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as SimpleWebRTC from 'simplewebrtc';

import { Menu, Button, Icon, Image, Label, Header } from "semantic-ui-react";

import Util from '../utils/util';

import { NotificationModal } from "../components/student/notificationmodal";
import { Frame } from "../components/student/frame";
import { Messages } from "../components/student/messages";

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface MainAppProps {
}

export interface MainAppState {
    iframeUrl?: string;
    sidebarOpen?: boolean;
    messages?: any[];
}

export class StudentApp extends React.Component<MainAppProps, MainAppState> {
    private pusher: any;
    private configChannel: any;
    private pingChannel: any;
    private messageChannel: any;
    private userChatChannel: any;

    private messagesComponent: Messages;

    constructor(props: MainAppProps) {
        super(props);
        this.state = {
            iframeUrl: config.iframeUrl,
            messages: []
        }

        this.handleNeedHelp = this.handleNeedHelp.bind(this);
        this.handleStartCall = this.handleStartCall.bind(this);
    }

    componentWillMount() {
        const courseId = Util.getCourseId();
        const studentId = Util.getStudentId();
        Pusher.logToConsole = false;
        this.pusher = new Pusher(config.PUSHER_APP_KEY, {
            encrypted: true
        });
        this.configChannel = this.pusher.subscribe('config' + courseId);
        this.pingChannel = this.pusher.subscribe('private-ping' + courseId);
        //this.messageChannel = this.pusher.subscribe('messages' + courseId);
        //this.messageChannel.bind('pusher:subscription_succeeded', this.retrieveMessageHistory, this);
        this.userChatChannel = this.pusher.subscribe('messages' + courseId + studentId);
        this.userChatChannel.bind('pusher:subscription_succeeded', this.retrieveStudentMessageHistory, this);
        let presenceChannel = this.pusher.subscribe('presence-channel' + courseId, {

        });
        presenceChannel.bind('pusher:subscription_succeeded', function () {
            var me = presenceChannel.members.me;
            var userId = me.id;
            var userInfo = me.info;
            console.log(userInfo);
        });
    }

    componentDidMount() {
        this.configChannel.bind('changed', (config: any) => {
            const newState: MainAppState = {};
            if (this.state.iframeUrl !== config.iframeUrl) {
                newState.iframeUrl = config.iframeUrl;
            }
            if (Object.keys(newState).length > 0) this.setState(newState);
        }, this);
        this.pingChannel.bind('client-ping' + Util.getCourseId(), (data: any) => {
            if (data.studentId == Util.getStudentId()) {
                Util.showNotification('Ping! Headphones On!', `Teacher is trying to contact you!`, '/public/images/notification/headphones.png');
            }
        })
        //this.messageChannel.bind('new_message', this.addMessage, this);
        this.userChatChannel.bind('new_message', this.addMessage, this);

        window.addEventListener('message', (e: any) => {
            const snapData = e.data;
            if (snapData && snapData.action && snapData.action == "save") {
                const projectName = snapData.name;
                location.hash = 'courseId=' +
                    encodeURIComponent(Util.getCourseId()) +
                    '&studentId=' +
                    encodeURIComponent(Util.getStudentId()) +
                    '&projectName=' +
                    encodeURIComponent(projectName);
            }
        }, false);

        let webrtc = new SimpleWebRTC({
            localVideoEl: "",
            remoteVideosEl: "",
            autoRequestMedia: true,
            media: { audio: true, video: false, screen: true }
            //url: 'https://your-production-signalserver.com/'
        });

        // we have to wait until it's ready
        webrtc.on('readyToCall', function () {
            // you can name it anything
            webrtc.joinRoom(Util.getCourseId() + Util.getStudentId());

            console.log("Joined call: " + Util.getCourseId() + Util.getStudentId());

            webrtc.shareScreen(function (err: any) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sharing screen");
                }
            });
        });
    }

    retrieveMessageHistory() {
        let self = this;
        let lastMessage = this.state.messages[this.state.messages.length - 1];
        let lastId = (lastMessage ? lastMessage.id : 0);
        const url = `/messages?after_id=${lastId}&courseId=${Util.getCourseId()}`
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                responseJson.forEach(self.addMessage, self);
            })
    }

    retrieveStudentMessageHistory() {
        let self = this;
        let lastMessage = this.state.messages[this.state.messages.length - 1];
        let lastId = (lastMessage ? lastMessage.id : 0);
        const url = `/studentmessages?after_id=${lastId}&courseId=${Util.getCourseId()}&studentId=${Util.getStudentId()}`
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                let messages = this.state.messages;
                responseJson.map((m: any) => { messages = messages.concat(self.addMessage(m, true)) }, self);
                messages.sort((a: any, b: any) => {
                    return (a.date > b.date) ? 1 : 0;
                });
                this.setState({ messages: messages });
            })
    }

    messageExists(message: any) {
        let getId = (e: any) => { return e.id };
        let ids = this.state.messages.map(getId);
        return ids.indexOf(message.id) !== -1;
    }

    addMessage(message: any, skipUpdate: boolean = false) {
        if (this.messageExists(message)) {
            console.warn('Duplicate message detected');
            return;
        }
        message.read = skipUpdate || this.state.sidebarOpen;
        if (!skipUpdate) {
            let messages = this.state.messages.concat(message);
            messages.sort((a: any, b: any) => {
                return (a.date > b.date) ? 1 : 0;
            });
            this.setState({ messages: messages });
        }
        return message;
        //$("#message-list").scrollTop($("#message-list")[0].scrollHeight);
    }

    handleStartCall(e: any) {
        Util.POSTUser('/register');
        if (session.remote_link) {
            window.open(session.remote_link + "?sl=");
        }
    }

    handleNeedHelp(e: any) {
        Util.POST('/help', {
            studentId: Util.getStudentId(),
            courseId: Util.getCourseId(),
            studentName: session.full_name || 'Unknown Name'
        });
    }

    handleOpenSidebar(e: any) {
        const sideBarOpen = !this.state.sidebarOpen;
        // Mark all messages as read
        const messages = this.state.messages.map((m) => {
            m.read = true;
            return m;
        });
        this.setState({ sidebarOpen: sideBarOpen, messages: messages })
        if (sideBarOpen) {
            if (this.messagesComponent) this.messagesComponent.scrollToBottom();
        }
    }

    render() {
        const { iframeUrl, sidebarOpen, messages } = this.state;
        const { full_name, user_image, remote_link, user_color, user_initials } = session;

        if (window.location.hash && Util.isInstructor()) {
            // Redirect to SNAP present
            const hash2Obj = window.location.hash.substr(1)
                .split("&")
                .map(el => el.split("="))
                .reduce((pre: any, cur: any) => { pre[cur[0]] = cur[1]; return pre; }, {});
            if (hash2Obj['courseId'] && hash2Obj['studentId'] && hash2Obj['projectName']) {
                window.location.href = `/public/SNAP/snap.html#present:Username=${hash2Obj['courseId'] + hash2Obj['studentId']}&ProjectName=${hash2Obj['projectName']}`;
            } else {
                window.location.href = `/admin`
            }
        }

        const snapUrl = `/public/SNAP/snap.html#login:${Util.getCourseId() + Util.getStudentId()}`;
        let unreadMessageCount = 0;
        messages.forEach(m => !m.read ? unreadMessageCount++ : undefined);
        return <div className="pusher">
            <div className={`main-body ${sidebarOpen ? 'sidebar-visible' : ''}`}>
                <Menu inverted borderless className="starter-menu">
                    <Menu.Menu position='left'>
                        <Menu.Item>
                            {user_image ? <Image spaced="right" avatar src={user_image} /> :
                                <div className='ui avatar right spaced image no-user-avatar' style={{ backgroundColor: user_color || '#512DA8' }}>{user_initials}</div>} {full_name}
                        </Menu.Item>
                    </Menu.Menu>
                    {remote_link ?
                        <Menu.Item>
                            <Button className="raise-hand" size='mini' color="green" icon labelPosition='left' onClick={this.handleStartCall}><Icon name='call' /> Start Call</Button>
                        </Menu.Item>
                        : undefined}
                    <Menu.Item>
                        <Button className="raise-hand" size='mini' color="yellow" icon labelPosition='left' onClick={this.handleNeedHelp}><Icon name='hand pointer' />Raise Hand</Button>
                    </Menu.Item>
                    <Menu.Item onClick={this.handleOpenSidebar.bind(this)}>
                        <Icon name='sidebar' />Messages
                        {unreadMessageCount > 0 ? <Label size="small" className='white'>{unreadMessageCount}</Label> : undefined}
                    </Menu.Item>
                </Menu>
                <div className="frame-body">
                    <Frame url={snapUrl} />
                </div>
            </div>
            <div className={`main-sidebar ${sidebarOpen ? 'sidebar-visible' : ''}`}>
                <Messages ref={e => this.messagesComponent = e} messages={messages} />
            </div>
            <NotificationModal open={false} type="ping" />
        </div>;
    }
}

ReactDOM.render(
    <StudentApp />,
    document.getElementById("root")
);