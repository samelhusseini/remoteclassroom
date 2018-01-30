import * as React from "react";

import {Container, Table, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea, Card} from 'semantic-ui-react';

export class ApplicationSelector extends React.Component {
    render() {
        return <Modal size='large' trigger={this.props.trigger}>
        <Header icon='plus' content='Select an App'/>
        <Modal.Description>
            <Grid padded>
            <Grid.Row centered>
            <Grid.Column>
            <Card.Group className="applications" itemsPerRow='3'>
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
                    <Button color='green'>Selected</Button>
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Image floated='right' size='mini' src='/public/images/apps/snap.png'/>
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
                    <Image floated='right' size='mini' src='/public/images/apps/scratch.png'/>
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
                    <Button basic>Select</Button>
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Image floated='right' size='mini' src='/public/images/apps/snap.png'/>
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
                    <Image floated='right' size='mini' src='/public/images/apps/scratch.png'/>
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
        </Grid.Column>
        </Grid.Row>
            </Grid>
        </Modal.Description>
        <Modal.Actions>
            <Button>
                Back
            </Button>
        </Modal.Actions>
    </Modal>
    }
}