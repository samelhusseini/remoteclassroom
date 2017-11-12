import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SimpleWebRTC from 'simplewebrtc';

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';

import Util from '../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface ScreenProps {
    channel: any;
}

export interface ScreenState {
}

export class Screen extends React.Component<ScreenProps, ScreenState> {

    private screenContainer: HTMLElement;

    constructor(props: ScreenProps) {
        super(props);
        this.state = {
            open: false,
            edit: false
        }
    }

    componentDidMount() {

        let webrtc = new SimpleWebRTC({
            localVideoEl: '',
            remoteVideosEl: '', // empty string
            autoRequestMedia: true
            //url: 'https://your-production-signalserver.com/'
        });

        // we have to wait until it's ready
        webrtc.on('readyToCall', function() {
            // you can name it anything
            webrtc.joinRoom(Util.getCourseId() + '8791939');
        });

        let screenContainer = this.screenContainer;

        // a peer video has been added
        webrtc.on('videoAdded', function (video: any, peer: any) {
            console.log('video added', peer);
            var remotes = document.getElementById('remotes');
            if (remotes) {
                var container = document.createElement('div');
                container.className = 'videoContainer';
                container.id = 'container_' + webrtc.getDomId(peer);
                container.appendChild(video);

                // suppress contextmenu
                video.oncontextmenu = function () { return false; };

                remotes.appendChild(container);
            }
        });

        // a peer video was removed
        webrtc.on('videoRemoved', function (video: any, peer: any) {
            console.log('video removed ', peer);
            var remotes = document.getElementById('remotes');
            var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
            if (remotes && el) {
                remotes.removeChild(el);
            }
        });

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

        return <Image src='http://arve0.github.io/example_lessons/scratch/Term%201/Lost%20in%20Space/space-scratch.png' />;
        // return <div>
        //     <div id="remotes"></div>
        //     <div id="localScreenContainer"
        //         ref={e => this.screenContainer = e}>
        //     </div>
        // </div >;
    }
}