/// <reference path="../../localtypings/remoteclassroom.d.ts" />

import * as React from "react";

import { Grid, Button, Container, Card, Icon, Image } from 'semantic-ui-react';

import Util from '../utils/util';

export interface JoinSelectorViewProps {
}

export interface JoinSelectorViewState {
}

export class JoinSelectorView extends React.Component<JoinSelectorViewProps, JoinSelectorViewState> {

    constructor(props: JoinSelectorViewProps) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    studentClick() {
        window.location.hash = 'joinstudent';
    }

    teacherClick() {
        window.location.hash = 'jointeacher';
    }

    render() {
        return <div className='pusher'>
            <Container textAlign='center' center aligned>
                <Card.Group itemsPerRow='two'>
                    <Card fluid onClick={() => this.studentClick()}>
                        <Card.Content>
                            <Card.Header>
                                Student
                        </Card.Header>
                        </Card.Content>
                    </Card>
                    <Card fluid onClick={() => this.teacherClick()}>
                        <Card.Content>
                            <Card.Header>
                                Teacher
                        </Card.Header>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </Container>
        </div>;
    }
}