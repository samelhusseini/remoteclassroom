import * as React from "react";

import {
    Container,
    Table,
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
    Card
} from 'semantic-ui-react';

import Apps from '../utils/apps';


export interface ApplicationSelectorProps {
    trigger: any,//todo not sure what type a react component is
    onSetApplication: (app: string) => void
}

export class ApplicationSelector extends React.Component<ApplicationSelectorProps> {
    constructor(props: ApplicationSelectorProps) {
        super(props);
    }

    render() {
        return <Modal size='large' trigger={this.props.trigger}>
            <Header icon='plus' content='Select an App'/>
            <Modal.Description>
                <Grid padded>
                    <Grid.Row centered>
                        <Grid.Column>
                            <Card.Group className="applications" itemsPerRow='3'>
                                {Apps.getApps().map((app) =>
                                    <Card>
                                        <Card.Content>
                                            <Image floated='right' size='mini'
                                                   src={'/public/images/apps/' + app.image}/>
                                            <Card.Header>
                                                {app.name}
                                            </Card.Header>
                                            <Card.Meta>
                                                {app.company}
                                            </Card.Meta>
                                            <Card.Description>
                                                {app.description}
                                            </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <Button basic onClick={() => this.props.onSetApplication.call(this, app.name)}>Select</Button>
                                        </Card.Content>
                                    </Card>
                                )}
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