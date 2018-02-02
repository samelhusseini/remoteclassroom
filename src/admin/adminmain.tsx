/// <reference path="../../localtypings/remoteclassroom.d.ts" />
/// <reference path="../../localtypings/simplewebrtc.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid, Button, Container, Segment, Menu, Icon, Header, Divider } from 'semantic-ui-react';
import { StatusFeed } from "../components/Feed";
import { UserSelector } from "../components/userselector";
import { WorkspaceSelector } from "../components/workspaceselector";
import { UserDetail } from "../components/userdetail";
import { WorkspaceDetail } from "../components/workspacedetail";
import { MainMenu } from "../components/MainMenu";

import { NewPostModal } from "../components/teacher/newpostmodal";

import * as SimpleWebRTC from 'simplewebrtc';

import Util from '../utils/util';

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

enum ViewType {
    Workspace, User
}
export interface AdminMainViewProps {
    history: any;
}
export interface AdminMainViewState {
    users: RemoteUser[];
    messages: any[];
    messagesLoaded?: boolean;
    currentView: ViewType,
    selectedUser?: RemoteUser;
    selectedUserOnline?: boolean;
    isWebRTCReady?: boolean;
}

export class AdminMainView extends React.Component<AdminMainViewProps, AdminMainViewState> {
    private pusher: any;
    private configChannel: any;
    private feedChannel: any;
    private messageChannel: any;
    private privateChannel: any;
    private presenceChannel: any;

    private webrtc: any;
    private connectedCallback: any;

    constructor(props: AdminMainViewProps) {
        super(props);
        this.state = {
            users: [],
            messages: [],
            currentView: ViewType.Workspace
        }
    }

    componentWillMount() {
        const courseId = session.course_id || 'TEST';
        Pusher.logToConsole = false;
        this.pusher = new Pusher(config.PUSHER_APP_KEY, {
            encrypted: true
        });
        this.configChannel = this.pusher.subscribe('config' + courseId);
        this.feedChannel = this.pusher.subscribe('feed' + courseId);
        this.privateChannel = this.pusher.subscribe('private-ping' + courseId);
        this.presenceChannel = this.pusher.subscribe('presence-channel' + courseId);
        this.messageChannel = this.pusher.subscribe('messages' + courseId);
        this.messageChannel.bind('pusher:subscription_succeeded', this.retrieveMessageHistory, this);
        this.setupWebRTC();
    }

    componentDidMount() {
        this.feedChannel.bind('update', (data: any) => {
            //this.updateFeed();
            const studentName = data.message.fullName;
            Util.showNotification('Hand raised!', `${studentName} raised his/her hand!`, data.message.avatarUrl);
        }, this);
        this.feedChannel.bind('loaded', (data: any) => {
            console.log("loaded");
        })
        this.feedChannel.bind('registered', (data: any) => {
            console.log("registered")
        })
        this.configChannel.bind('changed', (data: any) => {
            if (data.config == 'users') {
                this.updateUsers();
            }
        })
        this.messageChannel.bind('new_message', this.addMessage, this);
        this.updateUsers();
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
                let messages = this.state.messages;
                responseJson.map((m: any) => { messages = messages.concat(self.addMessage(m, true)) }, self);
                messages.sort((a: any, b: any) => {
                    return (a.date > b.date) ? 1 : 0;
                });
                this.setState({ messages: messages, messagesLoaded: true });
            })
    }

    addMessage(message: any, skipUpdate: boolean = false) {
        if (this.messageExists(message)) {
            console.warn('Duplicate message detected');
            return;
        }
        message.read = skipUpdate || message.student == Util.getStudentId();
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

    messageExists(message: any) {
        let getId = (e: any) => { return e.id };
        let ids = this.state.messages.map(getId);
        return ids.indexOf(message.id) !== -1;
    }

    updateUsers() {
        Util.POSTCourse('/users')
            .then((response: Response) => {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data: any) => {
                //console.log(data);
                this.setState({ users: data });
            });
    }

    setSelectedUser(user: RemoteUser, isOnline: boolean) {
        // Mark all messages as read
        const messages = this.state.messages.map((m) => {
            if (m.student == user.studentId)
                m.read = true;
        });
        this.setState({ selectedUser: user, selectedUserOnline: isOnline, currentView: ViewType.User });
    }

    sendTeacherMessage(user: RemoteUser, text: string) {
        // Add to message list (so that the message appears to send immediately)
        // const message = {

        // };
        // let messages = this.state.messages.concat(message);
        // messages.sort((a: any, b: any) => {
        //     return (a.date > b.date) ? 1 : 0;
        // });
        // this.setState({ messages: messages });

        // Post to server
        Util.POST('/new_teacher_message', {
            studentId: user.studentId,
            teacherId: Util.getStudentId(),
            courseId: Util.getCourseId(),
            text: text
        });
    }

    selectWorkspaceView() {
        this.setState({ selectedUser: null, selectedUserOnline: null, currentView: ViewType.Workspace })
    }

    /// WEB RTC ///
    connectRoom(studentId: string, connectedCallback: any) {
        const { isWebRTCReady } = this.state;

        const room = Util.getCourseId() + studentId;
        // we have to wait until it's ready
        console.log("Attempting to connect to: " + room);
        if (isWebRTCReady && this.webrtc) {
            console.log("Joined call: " + room);
            this.webrtc.joinRoom(room);
            this.connectedCallback = connectedCallback;
        }
    }

    disconnectRoom() {
        if (this.webrtc) {
            console.log("disconnecting from previous room")
            this.webrtc.leaveRoom();
        }
    }

    mute() {
        if (this.webrtc) this.webrtc.mute();
    }

    unmute() {
        if (this.webrtc) this.webrtc.unmute();
    }

    setupWebRTC() {
        console.log('setting up webrtc')

        let remotes = document.getElementById('remotes');
        if (remotes) remotes.innerHTML = '';

        let local = document.getElementById('localVideo');
        if (local) local.innerHTML = '';

        const that = this;

        this.webrtc = new SimpleWebRTC({
            localVideoEl: 'localVideo', // no video
            remoteVideosEl: '', // empty string
            autoRequestMedia: true,
            media: { audio: true, video: false, screen: true },
            //url: 'https://your-production-signalserver.com/'
            debug: false,
            detectSpeakingEvents: true,
            autoAdjustMic: false
        });

        // we got access to the camera
        this.webrtc.on('localStream', function (stream: any) {
            //var button = document.querySelector('form>button');
            //if (button) button.removeAttribute('disabled');
            //(document.getElementById('localVolume') as HTMLElement).style.display = 'block';
        });
        // we did not get access to the camera
        this.webrtc.on('localMediaError', function (err: any) {
        });

        this.webrtc.on('readyToCall', function () {
            // you can name it anything
            that.setState({ isWebRTCReady: true });
        });

        // local screen obtained
        this.webrtc.on('localScreenAdded', function (video: any) {
            video.onclick = function () {
                video.style.width = video.videoWidth + 'px';
                video.style.height = video.videoHeight + 'px';
            };
            let screenContainer = document.getElementById('localScreenContainer');
            screenContainer.appendChild(video);
            screenContainer.style.display = 'block';
        });
        // local screen removed
        this.webrtc.on('localScreenRemoved', function (video: any) {
            let screenContainer = document.getElementById('localScreenContainer');
            screenContainer.removeChild(video);
            screenContainer.style.display = 'none';
        });

        function showVolume(el: any, volume: any) {
            if (!el) return;
            if (volume < -45) volume = -45; // -45 to -20 is
            if (volume > -20) volume = -20; // a good range
            el.value = volume;
        }

        // a peer video has been added
        this.webrtc.on('videoAdded', function (video: any, peer: any) {
            console.log('video added', peer);
            var remotes = document.getElementById('remotes');
            if (remotes) {
                var container = document.createElement('div');
                container.className = 'videoContainer';
                container.id = 'container_' + that.webrtc.getDomId(peer);
                container.appendChild(video);

                // suppress contextmenu
                video.oncontextmenu = function () { return false; };

                // resize the video on click
                video.onclick = function () {
                    container.style.width = video.videoWidth + 'px';
                    container.style.height = video.videoHeight + 'px';
                };

                // show the remote volume
                // let vol = document.createElement('meter');
                // vol.id = 'volume_' + peer.id;
                // vol.className = 'volume';
                // vol.min = -45;
                // vol.max = -20;
                // vol.low = -40;
                // vol.high = -25;
                // container.appendChild(vol);

                // show the ice connection state
                if (peer && peer.pc) {
                    var connstate = document.createElement('div');
                    connstate.className = 'connectionstate';
                    container.appendChild(connstate);
                    peer.pc.on('iceConnectionStateChange', function (event: any) {
                        switch (peer.pc.iceConnectionState) {
                            case 'checking':
                                connstate.innerText = 'Connecting to peer...';
                                break;
                            case 'connected':
                            case 'completed': // on caller side
                                //vol.style.display = 'block';
                                connstate.innerText = 'Connection established.';
                                break;
                            case 'disconnected':
                                connstate.innerText = 'Disconnected.';
                                break;
                            case 'failed':
                                connstate.innerText = 'Connection failed.';
                                break;
                            case 'closed':
                                connstate.innerText = 'Connection closed.';
                                break;
                        }
                    });
                }
                remotes.appendChild(container);
            }

            // Call the connected callback
            if (that.connectedCallback) that.connectedCallback.call(this);
        });
        // a peer was removed
        this.webrtc.on('videoRemoved', function (video: any, peer: any) {
            console.log('video removed ', peer);
            var remotes = document.getElementById('remotes');
            var el = document.getElementById(peer ? 'container_' + that.webrtc.getDomId(peer) : 'localScreenContainer');
            if (remotes && el) {
                remotes.removeChild(el);
            }
        });

        // local volume has changed
        this.webrtc.on('volumeChange', function (volume: any, threshold: any) {
            //showVolume(document.getElementById('localVolume'), volume);
        });
        // remote volume has changed
        this.webrtc.on('remoteVolumeChange', function (peer: any, volume: any) {
            //showVolume(document.getElementById('volume_' + peer.id), volume);
        });

        // // local p2p/ice failure
        // this.webrtc.on('iceFailed', function (peer) {
        //     var connstate = document.querySelector('#container_' + that.webrtc.getDomId(peer) + ' .connectionstate');
        //     console.log('local fail', connstate);
        //     if (connstate) {
        //         connstate.innerText = 'Connection failed.';
        //         //fileinput.disabled = 'disabled';
        //     }
        // });

        // // remote p2p/ice failure
        // this.webrtc.on('connectivityError', function (peer) {
        //     var connstate = document.querySelector('#container_' + that.webrtc.getDomId(peer) + ' .connectionstate');
        //     console.log('remote fail', connstate);
        //     if (connstate) {
        //         connstate.innerText = 'Connection failed.';
        //         //fileinput.disabled = 'disabled';
        //     }
        // });

        // // local screen obtained
        // webrtc.on('localScreenAdded', function(video: any) {
        //     video.onclick = function() {
        //         video.style.width = video.videoWidth + 'px';
        //         video.style.height = video.videoHeight + 'px';
        //     };
        //     screenContainer.appendChild(video);
        //     screenContainer.style.display = 'block';
        // });
        // // local screen removed
        // webrtc.on('localScreenRemoved', function(video: any) {
        //     screenContainer.removeChild(video);
        //     screenContainer.style.display = 'none';
        // });
    }

    render() {
        const { selectedUser, selectedUserOnline, messagesLoaded } = this.state;

        let content;
        if (this.state.currentView == ViewType.Workspace) {
            content = <WorkspaceDetail />;
        } else {
            content = <UserDetail
                messages={this.state.messages.filter(m => selectedUser ? m.student == selectedUser.studentId : false)}
                user={selectedUser} channel={this.privateChannel}
                isOnline={selectedUserOnline} messagesLoaded={messagesLoaded}
                sendMessage={this.sendTeacherMessage.bind(this)}
                connect={this.connectRoom.bind(this)}
                disconnect={this.disconnectRoom.bind(this)}
                mute={this.mute.bind(this)}
                unmute={this.unmute.bind(this)} />;
        }
        return <div className="pusher">
            <div className="admin-sidebar">
                <div className="admin-scrollabale">
                    <Header inverted as='h2' className="inlineEdit default">Untitled Class</Header>
                    <WorkspaceSelector isSelected={this.state.currentView == ViewType.Workspace} onSelect={this.selectWorkspaceView.bind(this)} />
                    <UserSelector messages={this.state.messages} users={this.state.users} presenceChannel={this.presenceChannel} selectedUser={selectedUser} onSelectedUser={this.setSelectedUser.bind(this)} />
                    <div className="settings">
                        <Divider inverted />
                        <Menu vertical inverted fluid borderless className="user-selector">
                            <Menu.Item >
                                <Header inverted as='h4'> <Icon inverted name='settings' />Settings </Header>
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
            </div>
            <div className="admin-body">
                {content}
            </div>
        </div>;
    }
}