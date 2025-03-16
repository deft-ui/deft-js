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

const window = initWindow();
const element = <App />;
const pages = window.getPages();
if (pages && pages[0]) {
    pages[0].update(element);
} else {
    window.newPage(element);
}
// Hot reload
//@ts-ignore
module.hot && module.hot.accept();
