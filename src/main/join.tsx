/// <reference path="../../localtypings/remoteclassroom.d.ts" />

import * as React from "react";
import URLSearchParams from "react-router";
import Cookies from 'js-cookie'

const queryString = require('query-string');

import { Grid, Header, Image, Form, Segment, Button, Message, Container, Divider, Input, Icon } from 'semantic-ui-react';

import Util from '../utils/util';

export interface JoinViewProps {
}

export interface JoinViewState {
    userName: string;
}

export class JoinView extends React.Component<JoinViewProps, JoinViewState> {

    private courseid: string;

    constructor(props: JoinViewProps) {
        super(props);
        this.state = {
            userName: (window as any).Cookies.get('fullname') || ''
        }
    }

    componentWillMount() {
        const parsed = queryString.parse(location.search);
        this.courseid = parsed['launch'];
    }

    componentDidMount() {
    }

    joinClass() {
        if (this.state.userName) {
            // POST message to join with username and courseid
            Util.POST('/join', {
                'username': this.state.userName,
                'hashid': this.courseid
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
        this.setState({userName: val});
    }

    render() {
        return <Segment textAlign='center' className="starter-background" vertical>
        <Container text>
              <Header
                as='h1'
                content='Welcome to COMP3621'
                inverted
                style={{ fontSize: '3em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }}
              />
              <Header
                as='h2'
                content='Instructed by Lisa Smith'
                inverted
                style={{ fontSize: '1.9em', fontWeight: 'normal', marginTop: '0.5em' }}
              />
               <Divider inverted size='large'/>
              <Header
                as='h2'
                content='Enter your name to get started'
                inverted
                style={{ fontSize: '1.4em', fontWeight: 'normal' }}
              />
              <p><Input size='large'  focus placeholder='Your Name' required ref="username" value={this.state.userName} onChange={this.userNameChanged.bind(this)}/></p>
              <Button primary size='huge' onClick={() => this.joinClass()}> Get Started <Icon name='arrow right' /></Button>
            </Container>
          </Segment>;
    }
}