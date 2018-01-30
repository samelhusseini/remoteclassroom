import * as React from "react";

import { Card, Menu, Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea, Divider} from 'semantic-ui-react';
import {ApplicationSelector} from "./applicationselector";


export class WorkspaceDetail extends React.Component {
    render() {

        return <div className="admin-workspace-detail-panel">
            <Grid padded verticalAlign='middle'>
                <Grid.Row centered>
                <h1>Class Actions</h1>
                </Grid.Row>
                <Grid.Row centered>
                <Card.Group>
                    <Card>
                    <Card.Content textAlign='center'>
                        <Card.Header>
                            <Icon size='massive' color='blue' name='add'/>
                        </Card.Header>
                        <Card.Description>
                            <h3>No App Selected</h3>
                            Select an app for your class to use
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra textAlign='center'>
                        <Button primary>Select an App</Button>
                    </Card.Content>
                    </Card>


                    <Card>
                    <Card.Content textAlign='center'>
                        <Card.Header>
                            <Image size='small' src='/public/images/apps/google-docs.png'/>
                        </Card.Header>
                        <Card.Description>
                            <h3>Google Docs</h3>
                            Google Docs will be the application seen by students
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra textAlign='center'>
                        <Button>Change App</Button>
                    </Card.Content>
                    </Card>

                    <Card>
                    <Card.Content textAlign='center'>
                        <Card.Header>
                        <Icon size='massive' color='blue' name='browser'/>
                           
                        </Card.Header>
                        <Card.Description>
                            <h3>Present</h3>
                            Present your screen to the whole class
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra textAlign="center">
                        <Button color='green'>Start Presentation</Button>
                    </Card.Content>
                    </Card>
                    
                    <Card>
                    <Card.Content textAlign='center'>
                        <Card.Header>
                        <Icon size='massive' color='blue' name='comments'/>
                           
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
