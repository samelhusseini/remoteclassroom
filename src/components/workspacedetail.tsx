import * as React from "react";

import { Card, Menu, Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea} from 'semantic-ui-react';
import {ApplicationSelector} from "./applicationselector";


export class WorkspaceDetail extends React.Component {
    render() {

        return <div className="admin-workspace-detail-panel">
            <Grid padded>
                <Grid.Row>
                <Grid.Column width={16}>
                <h1>Class Actions</h1>
                <Card>
  <Card.Content textAlign="center">
    This should be centered.
  </Card.Content>
</Card>
                </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        

                        <Card>
                    <Card.Content>
                        <Image floated='right' size='mini' src='/public/images/apps/google-docs.png'/>
                        <Card.Header>
                            Google Docs
                        </Card.Header>
                        <Card.Meta>
                            Google
                        </Card.Meta>
                        <Card.Description>
                            Collaborative documents by Google.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button>Change App</Button>
                    </Card.Content>
                </Card>

    
                    </Grid.Column>
                    <Grid.Column width={5}>
                    <Card>
                    <Card.Content>
                        <Card.Header textAlign="center">
                        <Icon size='huge' name='browser'/>
                           
                        </Card.Header>
                        <Card.Description>
                            <h3>Present</h3>
                            Start a presentation in order to communicate to the entire class.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button color='green'>Start Presentation</Button>
                    </Card.Content>
                    </Card>
                    </Grid.Column>
                    <Grid.Column width={5}>
                    <h3>Broadcast message</h3>
                        <p>Broadcast a message to the entire class.</p>
                        <Form>
                            <Form.Field>
                                <input placeholder='Message'/>
                            </Form.Field>
                            <Button type='submit'>Send</Button>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </div>;
    }
}
