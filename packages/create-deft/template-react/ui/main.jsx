import {DeftWindow} from "deft-react";
import {App} from "./app";
import React from "react";

function initWindow() {
    const window = globalThis.mainWindow || (globalThis.mainWindow = new DeftWindow({
        title: 'Deft App',
    }));
    window.bindResize((e) => {
        console.log("window resized", e);
    });
    return window;
}

function main() {
    const window = initWindow();
    window.newPage(<App />)
}

main();

/// Hot reload support
module.hot && module.hot.accept();
