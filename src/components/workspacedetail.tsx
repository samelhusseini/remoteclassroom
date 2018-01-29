import * as React from "react";

import { Card, Menu, Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea} from 'semantic-ui-react';


export class WorkspaceDetail extends React.Component {
    render() {

        return <div className="admin-workspace-detail-panel">
            <Grid padded>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <h1>Class Actions</h1>

                        <h3>Application</h3>
                        <Card.Group className="applications">
                            <Card>
                                <Card.Content>
                                    <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
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
                                    <Button color='green'>Selected</Button>
                                </Card.Content>
                            </Card>
                            <Card>
                                <Card.Content>
                                    <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                                    <Card.Header>
                                        Snap
                                    </Card.Header>
                                    <Card.Meta>
                                        MIT Media Lab
                                    </Card.Meta>
                                    <Card.Description>
                                        Snap! is a visual, drag-and-drop programming language.
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <Button basic>Select</Button>
                                </Card.Content>
                            </Card>
                            <Card>
                                <Card.Content>
                                    <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                                    <Card.Header>
                                        Scratch
                                    </Card.Header>
                                    <Card.Meta>
                                        MIT Media Lab
                                    </Card.Meta>
                                    <Card.Description>
                                        Create stories, games, and animations. Share with others around the world
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <Button basic>Select</Button>
                                </Card.Content>
                            </Card>
                        </Card.Group>

                        <h3>Present</h3>
                        <p>Start a presentation in order to communicate to the entire class.</p>
                        <Button color="green">Start Presentation</Button>

                        <h3>Broadcast message</h3>
                        <p>Broadcast a message to the entire class.</p>
                        <Form>
                            <Form.Field>
                                <input placeholder='Message'/>
                            </Form.Field>
                            <Button type='submit'>Send</Button>
                        </Form>

                        <h3>Settings</h3>
                        <Form>
                            <Form.Group inline>
                            <Form.Field>
                                <label>Start time</label>
                                <Input placeholder='00:00' width={3} />
                            </Form.Field>
                            <Button type='submit'>Save</Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </div>;
    }
}
