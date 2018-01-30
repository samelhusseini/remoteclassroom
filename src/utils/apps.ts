interface App {
    name: string,
    company: string,
    description: string,
    image: string
}

const apps: { [name: string]: App } = {
    'Google Docs': {
        name: 'Google Docs',
        company: 'Google',
        description: 'Collaborative documents by Google.',
        image: 'google-docs.png'
    },
    'Snap': {
        name: 'Snap',
        company: 'MIT Media Lab',
        description: 'Snap! is a visual, drag-and-drop programming language.',
        image: 'snap.png'
    },
    'Scratch': {
        name: 'Scratch',
        company: 'MIT Media Lab',
        description: 'Create stories, games, and animations. Share with others around the world',
        image: 'scratch.png'
    }
};

export namespace Apps {
    export function getApps() {
        return Object.keys(apps).map(key => apps[key]);
    }

    export function getApp(app: string) {
        return apps[app];
    }
}

export default Apps