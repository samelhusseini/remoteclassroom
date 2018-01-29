/// <reference path="../../localtypings/remoteclassroom.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import { HashRouter, Route, Switch } from 'react-router-dom';

import { CreateView } from './create';
import { JoinSelectorView } from './joinselector';
import { JoinView } from './join';

export class MainApp extends React.Component<undefined, undefined> {

    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return <HashRouter>
            <Switch>
                <Route path="/create" component={CreateView} />
                <Route path="/join" component={JoinSelectorView} />
                <Route path="/joinstudent" component={JoinView} />
                <Route path="/jointeacher" component={JoinView} />
            </Switch>
        </HashRouter>
    }
}

ReactDOM.render(
    <MainApp />,
    document.getElementById("root")
);