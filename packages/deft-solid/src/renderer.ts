import {createRenderer} from 'solid-js/universal';
import {createNativeComponent, updateNativeComponent} from "./builtin-components";


export const {
    render,
    effect,
    memo,
    createComponent,
    createElement,
    createTextNode,
    insertNode,
    insert,
    spread,
    setProp,
    mergeProps,
    use
}  = createRenderer<Element>({
    createElement(type) {
        return createNativeComponent(type, {});
    },
    createTextNode(text) {
        // console.log("create text", text);
        const el = new LabelElement();
        el.text = text;
        return el;
    },
    replaceText(node, text) {
        // console.log("replace text", node, text);
        //@ts-ignore
        node.text = text;
    },
    insertNode(parent, el, anchor) {
        if (!el || !parent) return
        const p = parent as ContainerBasedElement;
        if (anchor) {
            p.addChildBefore(el, anchor);
        } else {
            p.addChild(el);
        }
    },
    removeNode(parent, node) {
        //@ts-ignore
        parent.removeChild(node);
    },
    setProperty(el, key, nextVal) {
        // console.log('patchProp', el, key);
        //TODO fix old prop
        const op = {}
        const np = {
            [key]: nextVal,
        }
        updateNativeComponent(el, op, np);
    },
    isTextNode(node) {
        return node instanceof LabelElement;
    },
    //@ts-ignore
    getParentNode(node) {
        //@ts-ignore
        return node?.parent
    },
    getFirstChild(node) {
        let el = node as ContainerBasedElement;
        return (el.children || [])[0] || null;
    },
    getNextSibling(node) {
        // console.log("getNextSibling", node);
        const parent = node.parent as ContainerBasedElement;
        let children = parent.children || [];
        const child = children.indexOf(node);
        if (child >= 0) {
            return children[child + 1] || null;
        } else {
            return null;
        }
    },
});
// Forward Solid control flow
export {
    For,
    Show,
    Suspense,
    SuspenseList,
    Switch,
    Match,
    Index,
    ErrorBoundary
} from "solid-js";