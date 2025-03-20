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
const body = new ContainerElement();
body.style = {
    color: '#fff',
}
window.body = body;

renderer.createApp(App).mount(body);
