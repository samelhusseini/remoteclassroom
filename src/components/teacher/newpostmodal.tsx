import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Card, Input, Grid } from 'semantic-ui-react';

import Util from '../../utils/util';


declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface NewPostModalProps {
    trigger: any;
}

export interface NewPostModalState {
    tab: string;
}

export class NewPostModal extends React.Component<NewPostModalProps, NewPostModalState> {

    constructor(props: NewPostModalProps) {
        super(props);
        this.state = {
            tab: "message"
        }
    }
    handleTabChanged(inputTab:string){
        this.setState({tab:inputTab})
    }


    render() {
        const { tab } = this.state;
        return <Modal trigger={this.props.trigger} closeIcon={true}>
            <Header icon='add' content='New Message to Entire Class' />
            <Modal.Content>
                <Grid>
                    <Grid.Row >
                        <Grid.Column textAlign='center'>
                            <Button.Group basic>
                                <Button active={tab == "message"} onClick={()=>{this.handleTabChanged('message')}}>Message Entire Class</Button>
                                <Button active={tab == "link"} onClick={()=>{this.handleTabChanged('link')}}>Send Link to Entire Class</Button>
                                <Button active={tab == "poll"} onClick={()=>{this.handleTabChanged('poll')}}>Check Status of Entire Class</Button>
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                    {tab == "message" ?
                        <Grid.Row>
                            <Grid.Column textAlign='right'>
                                <Form>
                                    <Form.TextArea autoHeight placeholder='Enter Message here' rows={1} />
                                    <Form.Button primary>Send Message</Form.Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row> : undefined}
                    {tab == "link" ?
                    <Grid.Row>
                        <Grid.Column textAlign='right'>
                            <Form>
                                <Form.TextArea autoHeight placeholder='Enter link here, e.g. http://www.google.com' rows={1} />
                                <Form.TextArea autoHeight placeholder='Enter link text here, e.g. Go here to search' rows={1} />
                                <Form.Button primary>Send Link</Form.Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row> : undefined}
                    {tab == "poll" ?
                    <Grid.Row>
                        <Grid.Column textAlign='left'>
                            <h4>This will send a message to all students asking them: "How are you doing so far?"</h4>
                            <p>Results will be displayed in each students tab as they answer the question</p>

                            <Button floated='right' primary>Send Survey</Button>

                        </Grid.Column>
                    </Grid.Row> : undefined}
                </Grid>
            </Modal.Content>
        </Modal >
    }
}