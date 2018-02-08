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
    open: boolean;//todo not sure what type a react component is
    onSetApplication: (app: string) => void;
}

export interface ApplicationSelectorState {
    open?: boolean;
}

export class ApplicationSelector extends React.Component<ApplicationSelectorProps, ApplicationSelectorState> {
    constructor(props: ApplicationSelectorProps) {
        super(props);
        this.state = {
            open: this.props.open
        }
    }

    hide() {
        this.setState({ open: false });
    }

    componentWillReceiveProps(nextProps: ApplicationSelectorProps) {
        const newState: ApplicationSelectorState = {};
        if (nextProps.open != undefined) {
            newState.open = nextProps.open;
        }
        if (Object.keys(newState).length > 0) this.setState(newState)
    }

    render() {
        return <Modal size='large' open={this.state.open} onClose={this.hide.bind(this)}>
            <Header icon='plus' content='Select an App' />
            <Modal.Description>
                <Grid padded>
                    <Grid.Row centered>
                        <Grid.Column>
                            <Card.Group className="applications" itemsPerRow='3'>
                                {Apps.getApps().map((app) =>
                                    <Card>
                                        <Card.Content>
                                            <Image floated='right' size='mini'
                                                src={'/public/images/apps/' + app.image} />
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
                <Button onClick={this.hide.bind(this)}>
                    Back
                </Button>
            </Modal.Actions>
        </Modal>
    }
}