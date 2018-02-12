/// <reference path="../../localtypings/remoteclassroom.d.ts" />

import * as React from "react";

import { Grid, Header, Image, Form, Segment, Button, Message, Container, Input, Icon } from 'semantic-ui-react';

import Util from '../utils/util';

export interface CreateViewProps {
}

export interface CreateViewState {
}

export class CreateView extends React.Component<CreateViewProps, CreateViewState> {

    private userName: string;
    private className: string;

    constructor(props: CreateViewProps) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    createClass() {
        console.log(this.userName, this.className);
        if (this.userName) {
            // POST message to create with username and classname
            Util.POST('/create', {
                'username': this.userName,
                'classname': this.className || ''
            }).then((data) => {
                data.text().then((text) => {
                    if (text) {
                        // Redirect to 
                        window.location.href = '/' + text;
                    }
                });
            })
        }
    }

    userNameChanged(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        this.userName = val;
    }

    classNameChanged(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        this.className = val;
    }

    handleKeyPress(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.createClass();
        }
    }

    render() {
        return <Segment textAlign='center' className="starter-background" vertical>
            <Container text>
                <Header
                    as='h1'
                    content='Welcome to Remote Class'
                    inverted
                    style={{ fontSize: '3em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }}
                />
                <Header
                    as='h2'
                    content='Enter your name to create your class'
                    inverted
                    style={{ fontSize: '1.6em', fontWeight: 'normal' }}
                />
                <p><Input size='large' focus placeholder='Your Name' ref="username" required onChange={this.userNameChanged.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} /></p>
                <Button primary size='huge' onClick={() => this.createClass()}> Get Started <Icon name='arrow right' /></Button>
            </Container>
        </Segment>;
    }
}