import {render} from "deft-react";
import {App} from "./app";
import React from "react";

class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        console.error(error);
    }
    render() {
        return this.props.children;
    }
}

function initWindow() {
    const window = globalThis.mainWindow || (globalThis.mainWindow = new Window({
        title: 'Deft App',
    }));
    window.bindResize((e) => {
        console.log("window resized", e);
    });
    return window;
}

const window = initWindow();
const root = <ErrorBoundary><App/></ErrorBoundary>
render(window, root);
// Hot reload
//@ts-ignore
module.hot && module.hot.accept();
