import * as React from "react";

import { Image } from 'semantic-ui-react';

export interface ScreenProps {
}

export class Screen extends React.Component<ScreenProps, undefined> {
    render() {

        return <Image src='http://arve0.github.io/example_lessons/scratch/Term%201/Lost%20in%20Space/space-scratch.png' />;
    }
}