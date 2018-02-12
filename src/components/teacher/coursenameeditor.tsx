import * as React from "react";
import * as ReactDOM from "react-dom";

import { Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input } from 'semantic-ui-react';
import { ChangeEvent, FocusEvent } from "react";

import Util from '../../utils/util';

export interface CourseNameEditorProps {
    name?: string;
}

export interface CourseNameEditorState {
    name?: string;
    editing?: boolean;
}

export class CourseNameEditor extends React.Component<CourseNameEditorProps, CourseNameEditorState> {

    private static DEFAULT_PROJECT_NAME = 'Untitled Class';

    private input: Input;

    constructor(props: CourseNameEditorProps) {
        super(props);
        this.state = {
            name: props.name || CourseNameEditor.DEFAULT_PROJECT_NAME
        }
    }

    handleClick() {
        this.setState({ editing: true });
    }

    handleLostFocus() {
        this.setState({ editing: false });
        this.saveName();
    }

    handleFocus(event: Event) {
        (event.target as any).select();
    }

    handleChange(event: KeyboardEvent) {
        this.setState({ name: (event.target as any).value });
    }

    handleKeyPress(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.setState({ editing: false });
        }
    }

    saveName() {
        let name = this.state.name;
        if (!name) name = CourseNameEditor.DEFAULT_PROJECT_NAME;

        // Saving name
        Util.POST('/update_course', {
            courseId: Util.getCourseId(),
            courseName: name
        });

        this.setState({ name: name });
    }

    render() {
        const { name, editing } = this.state;
        if (editing) {
            return <Input autoFocus className="inlineEdit" ref={e => this.input = e}
                value={name} onFocus={this.handleFocus.bind(this)} 
                onChange={this.handleChange.bind(this)} 
                onBlur={this.handleLostFocus.bind(this)} 
                onKeyPress={this.handleKeyPress.bind(this)} />
        } else {
            return <Header inverted as='h2' className="inlineEdit default" onClick={this.handleClick.bind(this)}>{name}</Header>
        }
    }
}