function initWindow() {
    const window = globalThis.mainWindow || (globalThis.mainWindow = new Window({}));
    window.title = "Deft App";
    window.bindResize((e) => {
        console.log("window resized", e);
    });
    return window;
}

function createBody() {
    const container = new ContainerElement();
    container.style = {
        background: "#2a2a2a",
        color: "#FFF",
        padding: 5,
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
    };

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
    window.body = createBody();
}

main();

/// Hot reload support
module.hot && module.hot.accept();
