/// <reference path="../../localtypings/remoteclassroom.d.ts" />
import * as React from "react";
import * as ReactDOM from "react-dom";

import { HashRouter, Route, Switch } from 'react-router-dom';

import { MainView } from './Main';
import { SettingsView } from './Settings';

export class AdminApp extends React.Component<undefined, undefined> {
    private pusher: any;
    private configChannel: any;
    private feedChannel: any;

    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return <HashRouter>
            <Switch>
                <Route path="/settings" component={SettingsView} />
                <Route path="/" component={MainView} />
            </Switch>
        </HashRouter>
    }
}

ReactDOM.render(
    <AdminApp />,
    document.getElementById("root")
);