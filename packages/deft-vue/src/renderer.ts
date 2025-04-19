import {createRenderer} from "@vue/runtime-core";
import {createNativeComponent, updateNativeComponent} from "./builtin-components";
export const renderer = createRenderer<Element | null, Element | null>({
    createElement(type, isSVG, isCustomizedBuiltIn, props) {
        return createNativeComponent(type, props)
    },
    insert(el, parent, anchor) {
        if (!el || !parent) return
        const p = parent as ContainerBasedElement;
        if (anchor) {
            p.addChildBefore(el, anchor);
        } else {
            p.addChild(el);
        }
    },
    remove(el) {
        let parent = el.parent as ContainerBasedElement;
        if (parent) {
            parent.removeChild(el);
        }
    },
    patchProp(el, key, preVal, nextVal) {
        // console.log('patchProp', el, key, preVal, nextVal);
        const op = {
            [key]: preVal,
        }
        const np = {
            [key]: nextVal,
        }
        updateNativeComponent(el, op, np);
    },
    createText(text) {
        // console.log("create text", text);
        const el = new LabelElement();
        el.text = text;
        return el;
    },
    createComment(_text) {
        return null;
    },
    setText(node, text) {
        // console.log('set text', node, text);
        //@ts-ignore
        node.text = text;
    },
    setElementText(element, text) {
        // console.log('set element text', element, text);
        const el = element as ContainerBasedElement;
        //TODO dont add private _textElement
        // @ts-ignore
        let label = el._textElement;
        if (!label) {
            label = new LabelElement();
            // @ts-ignore
            el._textElement = label;
            el.addChild(label);
        }
        label.text = text;
    },
    parentNode(node) {
        return node?.parent
    },
    nextSibling(node) {
        //TODO impl
        const p = node.parent as ContainerBasedElement;
        // return node?.parent.children[node.parent.getChildIndex(node) + 1] || null
        return null;
    },
    setScopeId(el: Element | null, id: string) {
        el?.setAttribute(id, "");
    }
})