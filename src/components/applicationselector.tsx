import * as React from "react";

import {Card, Button, Image} from 'semantic-ui-react';

export class ApplicationSelector extends React.Component {
    render() {
        return <div>
            <h3>Application</h3>
            <Card.Group className="applications">
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
            </Card.Group>
        </div>
    }
}