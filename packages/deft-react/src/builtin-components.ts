function getSetterName(prop) {
    return 'set' + prop.substring(0, 1).toUpperCase() + prop.substring(1);
}

function getEventBindName(prop) {
    if (prop.startsWith("on")) {
        return `bind` + prop.substring(2)
    }
    return null;
}

export function updateNativeComponent(el, oldProps, props) {
    props = props || {}
    try {
        for (const [p, v] of Object.entries(props)) {
            if (props[p] === oldProps[p]) {
                continue;
            }
            try {
                const setter = el[getSetterName(p)];
                if (setter) {
                    setter.call(el, v);
                    continue;
                }
                const binderName = getEventBindName(p);
                if (binderName) {
                    const binder = el[binderName];
                    binder.call(el, v);
                    continue;
                }
                if (p !== "children") {
                    // console.log("Unknown property:" + p);
                    el[p] = v;
                }
            } catch (error) {
                console.error(`failed to update prop: ${p}`, error);
            }
        }
    } catch (error) {
        console.error('failed to update component', error);
    }
}

export function createNativeComponent(tag: string, props) {
    const NativeElement = {
        label: LabelElement,
        button: ButtonElement,
        container: ContainerElement,
        entry: EntryElement,
        scroll: ScrollElement,
        textedit: TextEditElement,
        image: ImageElement,
        paragraph: ParagraphElement,
    }[tag];
    const element = new NativeElement();
    updateNativeComponent(element, {}, props);
    return element;
}

