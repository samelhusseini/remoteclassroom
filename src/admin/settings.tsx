/// <reference path="../../localtypings/remoteclassroom.d.ts" />

import * as React from "react";

import { Grid, Button, Container, Segment, Menu, Icon, Form, Input} from 'semantic-ui-react';
import { StatusFeed } from "../components/Feed";
import { Users } from "../components/Users";
import { MainMenu } from "../components/Menu";

import Util from '../utils/util';

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface SettingsViewProps {
    history: any;
}

export interface SettingsViewState {
}

export class SettingsView extends React.Component<SettingsViewProps, SettingsViewState> {

    constructor(props: SettingsViewProps) {
        super(props);

        this.handleIframeChanged = Util.debounce(this.handleIframeChanged, 1000);
        this.handleSkypeChanged = Util.debounce(this.handleSkypeChanged, 1000);
        this.save = this.save.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    handleIframeChanged(data: any) {
        this.updateIFrame(data.value);
    }

    handleSkypeChanged(data: any) {
        this.updateSkype(data.value);
    }

    updateIFrame(value: string) {
        Util.POST('/update_settings', {
            courseId: Util.getCourseId(),
            settingName: 'iframeUrl',
            settingValue: value
        })
    }

    updateSkype(value: string) {
        Util.POST('/update_settings', {
            courseId: Util.getCourseId(),
            settingName: 'classSkype',
            settingValue: value
        })
    }

    save() {
        this.props.history.push('/');
    }
    //<Form.Field control={Input} label='IFrame link' placeholder='IFrame link' onChange={(event: any, data: object) => this.handleIframeChanged(data)} />
    render() {
        return <div className="pusher">
            <MainMenu activeItem="settings" history={this.props.history} />
            <Container>
                <Segment inverted raised>
                    <Form inverted>
                        <Form.Field control={Input} label='Classroom Skype' placeholder='Classroom Skype link' onChange={(event: any, data: object) => this.handleSkypeChanged(data)} />
                        <Button primary type='submit' onClick={() => this.save()}>Save</Button>
                    </Form>
                </Segment>
            </Container>
        </div>;
    }
}