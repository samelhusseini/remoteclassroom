/// <reference path="../../localtypings/remoteclassroom.d.ts" />

import * as React from "react";

import { Grid, Header, Image, Form, Segment, Button, Message } from 'semantic-ui-react';

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
                                onChange={this.userNameChanged.bind(this)}
                            />
                            <Form.Input
                                ref="classname"
                                fluid
                                icon='group'
                                iconPosition='left'
                                placeholder='Class Name'
                                onChange={this.classNameChanged.bind(this)}
                            />
                            <Button color='blue' fluid size='large' onClick={() => this.createClass()}>Create Class</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>;
    }
}