/// <reference path="../../localtypings/remoteclassroom.d.ts" />

import * as React from "react";
import URLSearchParams from "react-router";
import Cookies from 'js-cookie'

const queryString = require('query-string');

import { Grid, Header, Image, Form, Segment, Button, Message } from 'semantic-ui-react';

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
        return <div className='create-form'>
            {/*
            Heads up! The styles below are necessary for the correct render of this example.
            You can do same with CSS, the main idea is that all the elements up to the `Grid`
            below must have a height of 100%.
            */}
            <style>{`
            body > div,
            body > div > div,
            body > div > div > div.create-form {
                height: 100%;
            }
            `}</style>
            <Grid
                textAlign='center'
                style={{ height: '100%' }}
                verticalAlign='middle'
            >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                ref="username"
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Your Name'
                                required
                                value={this.state.userName}
                                onChange={this.userNameChanged.bind(this)}
                            />
                            <Button color='blue' fluid size='large' onClick={() => this.joinClass()}>Join</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>;
    }
}