function initWindow() {
    const window = globalThis.mainWindow || (globalThis.mainWindow = new Window({}));
    window.setTitle("Deft App");
    window.bindResize((e: IResizeEvent) => {
        console.log("window resized", e);
    });
    return window;
}

function createBody() {
    const container = new ContainerElement();
    container.setStyle({
        background: "#2a2a2a",
        color: "#FFF",
        padding: 5,
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
    });

    const label = new LabelElement();
    label.setText("Welcome to Your Deft App");
    label.setStyle({
        fontSize: 28,
    });
    container.addChild(label);

    const tip = new LabelElement();
    tip.setText("Edit ui/main.ts and save to reload");
    tip.setStyle({
        color: '#5FD8F9',
    })
    container.addChild(tip);

    return container;
}

function main() {
    const window = initWindow();
    const body = createBody();
    window.setBody(body);
}

main();

/// Hot reload support
//@ts-ignore
module.hot && module.hot.accept();
