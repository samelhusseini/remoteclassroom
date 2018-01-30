import * as React from "react";

import {Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Menu, Label} from 'semantic-ui-react';

export interface WorkspaceProps {
    isSelected: boolean,
    onSelect: () => void
}
export class WorkspaceSelector extends React.Component<WorkspaceProps> {

    constructor(props: WorkspaceProps) {
        super(props);
    }
    render() {
        return <Menu vertical inverted fluid borderless className="workspace-selector">
            <Menu.Item active={this.props.isSelected} onClick={() => this.props.onSelect.call(this)}>
                <p><Icon name="group" size="large" /> Classroom</p>
            </Menu.Item>
        </Menu>;
    }
}