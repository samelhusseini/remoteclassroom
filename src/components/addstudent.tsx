import * as React from "react";

import { Container, Table, Button, Icon, Modal, Form, Header, Image, Input, Grid, Comment, TextArea} from "semantic-ui-react";

export interface AddStudentProps {
    trigger: any, // TODO: not sure what type a react component is
    courseLink?: string
}

export class AddStudent extends React.Component<AddStudentProps> {
    constructor(props: AddStudentProps) {
        super(props);
    }

    copyCourseLink() {
        const linkText = document.createElement('p');
        linkText.innerText = this.props.courseLink;
        document.body.appendChild(linkText);

        const range = document.createRange();
        range.selectNodeContents(linkText);
        window.getSelection().addRange(range);

        document.execCommand("copy");

        document.body.removeChild(linkText);
    }

    render() {
        return <Modal trigger={this.props.trigger}>
            <Header icon="add user" content="Invite Students"/>
            <Modal.Description>
                <Container text>
                    <p></p>
                    <Header as="h3">Class sharelink</Header>
                    <p>Send students the following share link and they will be added to the class</p>
                    <p>
                        <Input size="medium" fluid
                                action={
                                    {
                                        color: "blue",
                                        labelPosition: "right",
                                        icon: "copy",
                                        content: "Copy",
                                        onClick: (e: any) => { this.copyCourseLink(); }
                                    }
                                }
                                defaultValue={this.props.courseLink} />
                    </p>
                    <Header as="h3">Email invite</Header>
                    <p>Send students an email requesting them to join the class</p>
                    <p><Input focus placeholder="Enter email address"/> <Button primary size="large"> Send
                        Invite</Button></p>
                    <Table basic="very">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>john@test.com</Table.Cell>
                                <Table.Cell>Email sent</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>john@test.com</Table.Cell>
                                <Table.Cell>Email sent</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <p></p>
                </Container>
            </Modal.Description>
            <Modal.Actions>
                <Button>
                    Back
                </Button>
            </Modal.Actions>
        </Modal>
    }
}