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

export class MainApp extends React.Component<MainAppProps, MainAppState> {
    private pusher: any;
    private configChannel: any;
    private pingChannel: any;
    private messageChannel: any;

    constructor(props: MainAppProps) {
        super(props);
        this.state = {
            iframeUrl: config.iframeUrl
        }

        this.handleNeedHelp = this.handleNeedHelp.bind(this);
        this.handleStartCall = this.handleStartCall.bind(this);
    }

    componentWillMount() {
        const courseId = Util.getCourseId();
        Pusher.logToConsole = true;
        this.pusher = new Pusher(config.PUSHER_APP_KEY, {
            encrypted: true
        });
        this.configChannel = this.pusher.subscribe('config' + courseId);
        this.pingChannel = this.pusher.subscribe('private-ping' + courseId);
        this.messageChannel = this.pusher.subscribe('messages' + courseId);
        this.messageChannel.bind('pusher:subscription_succeeded', this.retrieveMessageHistory, this);
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
        this.messageChannel.bind('new-message', this.addMessage, this);

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

        // let webrtc = new SimpleWebRTC({
        //     localVideoEl: "",
        //     remoteVideosEl: "",
        //     autoRequestMedia: true,
        //     media: { audio: true, video: false, screen: true }
        //     //url: 'https://your-production-signalserver.com/'
        // });

        // // we have to wait until it's ready
        // webrtc.on('readyToCall', function () {
        //     // you can name it anything
        //     webrtc.joinRoom(Util.getCourseId() + Util.getStudentId());

        //     webrtc.shareScreen(function (err: any) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log("Sharing screen");
        //         }
        //     });
        // });
    }

    addMessage(message: any) {
        if (this.messageExists(message)) {
            console.warn('Duplicate message detected');
            return;
        }
        let messages = this.state.messages.concat(message);
        messages.sort((a: any, b: any) => {
            return (a.time > b.time);
        });
        this.setState({ messages: messages });

        //$("#message-list").scrollTop($("#message-list")[0].scrollHeight);
    }

    messageExists(message: any) {
        let getId = (e: any) => { return e.id };
        let ids = this.state.messages.map(getId);
        return ids.indexOf(message.id) !== -1;
    }

    retrieveMessageHistory() {
        var self = this;
        var lastMessage = this.state.messages[this.state.messages.length - 1];
        var lastId = (lastMessage ? lastMessage.id : 0);

        fetch('/messages', {
            method: 'GET',
            credentials: 'include'
        }).then((response: any) => {
            response.results.forEach(self.addMessage, self);
        })
        // $.get('/messages', { after_id: lastId }).success(function (response) {
        //     response.results.forEach(self.addMessage, self);
        // });
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
        this.setState({ sidebarOpen: !this.state.sidebarOpen })
    }

    render() {
        const { iframeUrl, sidebarOpen } = this.state;
        const { full_name, user_image, remote_link } = session;

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
        return <div className="pusher">
            <div className={`main-body ${sidebarOpen ? 'sidebar-visible' : ''}`}>
                <Menu inverted borderless className="starter-menu">
                    <Menu.Menu position='left'>
                        <Menu.Item>
                        <Image spaced="right" avatar src='https://digitalsummit.com/wp-content/uploads/2017/01/bobby-singh.jpg' /> {full_name}
                        </Menu.Item>
                    </Menu.Menu>
                    {remote_link ?
                        <Menu.Item>
                            <Button color="green" icon labelPosition='left' onClick={this.handleStartCall}><Icon name='call' /> Start Call</Button>
                        </Menu.Item> : undefined}
                    <Menu.Item>
                        <Button className="raise-hand" size='mini' color="yellow" icon labelPosition='left' onClick={this.handleNeedHelp}><Icon name='hand pointer' />Raise Hand</Button>
                    </Menu.Item>
                    <Menu.Item onClick={this.handleOpenSidebar.bind(this)}>
                        <Icon name='sidebar'/>Open Messages
                        <Label size="small" className='white'>1</Label>
                    </Menu.Item>
                </Menu>
                <div className="frame-body">
                    <Frame url={snapUrl} />
                </div>
            </div>
            <div className={`main-sidebar ${sidebarOpen ? 'sidebar-visible' : ''}`}>
                <Messages />
            </div>
            <NotificationModal open={false} type="ping" />
        </div>;
    }
}

ReactDOM.render(
    <MainApp />,
    document.getElementById("root")
);