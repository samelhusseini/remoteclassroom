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

                        <ApplicationSelector />

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
