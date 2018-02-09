import * as React from "react";

import {
    Card,
    Menu,
    Table,
    Checkbox,
    Button,
    Icon,
    Modal,
    Form,
    Header,
    Image,
    Input,
    Grid,
    Comment,
    TextArea,
    Divider
} from 'semantic-ui-react';
import { ApplicationSelector } from "./applicationselector";

import Apps from '../utils/apps';
import { TeacherPresent } from "./teacher/teacherpresent";


export interface WorkspaceDetailProps {
}

export interface WorkspaceDetailState {
    app?: string;
    appSelectorVisible?: boolean;
}

export class WorkspaceDetail extends React.Component<WorkspaceDetailProps, WorkspaceDetailState> {
    constructor(props: WorkspaceDetailProps) {
        super(props);
        this.state = {
            app: null
        }
    }

    onSetApplication(app: string) {
        this.setState({ app: app, appSelectorVisible: false});

        
    }

    getApplication() {
        const hasApp = !!this.state.app;
        const app = hasApp ? Apps.getApp(this.state.app) : undefined;
        return <Card>
            <Card.Content textAlign='center'>
                <Card.Header>
                    {hasApp ?
                        <Image size='small' src={'/public/images/apps/' + app.image} /> :
                        <Icon size='massive' color='blue' name='add' />}
                </Card.Header>
                {hasApp ?
                    <Card.Description>
                        <h3>{app.name}</h3>
                        {app.description}
                    </Card.Description> :
                    <Card.Description>
                        <h3>No App Selected</h3>
                        Select an app for your class to use
                        </Card.Description>}
            </Card.Content>
            <Card.Content extra textAlign='center'>
                <ApplicationSelector
                    open={this.state.appSelectorVisible}
                    onSetApplication={this.onSetApplication.bind(this)} />
                <Button primary onClick={() => this.setState({ appSelectorVisible: true })}>{hasApp ? 'Change App' : 'Select an App'}</Button>
            </Card.Content>
        </Card>;

    }

    render() {

        return <div className="admin-workspace-detail-panel">
            <Grid padded verticalAlign='middle'>
                <Grid.Row centered>
                    <h1>Classroom</h1>
                </Grid.Row>
                <Grid.Row centered>
                    <Card.Group>
                        {this.getApplication()}

                        <TeacherPresent />

                        <Card>
                            <Card.Content textAlign='center'>
                                <Card.Header>
                                    <Icon size='massive' color='blue' name='comments' />

                                </Card.Header>
                                <Card.Description>
                                    <h3>Class message</h3>
                                    Broadcast a message to the entire class
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra textAlign="center">

                                <Input action={{ color: 'blue', content: 'Send' }} placeholder='Message...' />
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Grid.Row>
            </Grid>

        </div>;
    }
}
