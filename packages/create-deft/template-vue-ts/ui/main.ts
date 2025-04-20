import App from "./App.vue";
import {renderer} from "deft-vue";

function initWindow(): Window {
    const window = globalThis.mainWindow || (globalThis.mainWindow = new Window({
        title: 'Deft App',
        width: 400,
        height: 400,
    }));
    window.bindResize((e: IResizeEvent) => {
        console.log("window resized", e);
    });
    return window;
}

const window = initWindow();
renderer.createApp(App).mount(window.body);
