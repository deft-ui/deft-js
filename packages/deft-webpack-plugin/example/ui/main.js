import "./main.css"

function initWindow() {
    const window = globalThis.mainWindow || (globalThis.mainWindow = new Window({}));
    window.title = "Deft App";
    window.bindResize((e) => {
        console.log("window resized", e);
    });
    return window;
}

function createContent() {
    const container = new ContainerElement();
    container.className = "main";

    const label = new LabelElement();
    label.text = "Welcome to Your Deft App";
    label.style = {
        fontSize: 20,
    };
    container.addChild(label);

    const tip = new LabelElement();
    tip.text = "Edit ui/main.js and save to reload";
    tip.style = {
        color: '#5FD8F9',
    }
    container.addChild(tip);

    return container;
}

function main() {
    const window = initWindow();
    window.body.addChild(createContent());
}

main();

/// Hot reload support
module.hot && module.hot.accept();
