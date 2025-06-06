import Reconciler from 'react-reconciler'
import React, {ReactNode} from "react";
import PageRoot from "./page-root";
import {createNativeComponent, updateNativeComponent} from "./builtin-components";

const DEBUG = false;
const emptyObject = Object.create(null);

function appendInitialChild(parentInstance, child) {
    parentInstance.addChild(child)
}

function createInstance(type, props, internalInstanceHandle) {
    return createNativeComponent(type, props);
}

function finalizeInitialChildren(docElement, type, props) {
    DEBUG && console.log('finalizeInitialChildren')
    return false
}

function getPublicInstance(instance) {
    return instance
}

function prepareForCommit() {
    // console.log('getPublicInstance')
}

function prepareUpdate() {
    // always update
    return true
}

function resetAfterCommit() {
}

function getRootHostContext() {
    return emptyObject
}

function getChildHostContext() {
    return emptyObject
}

function shouldSetTextContent() {
    return false
}

function resetTextContent() {
    //TODO impl?
}

function createTextInstance(text) {
    return createNativeComponent("label", {text})
}

function shouldDeprioritizeSubtree(type, props) {
    return false
}

// Mutation
function appendChild(parentInstance, child) {
    DEBUG && console.log("appendChild", child);
    parentInstance.addChild(child)
}

function appendChildToContainer(parentInstance, child) {
    DEBUG && console.log("appendChildToContainer", child);
    parentInstance.addChild(child)
}

function removeChild(parentInstance, child) {
    DEBUG && console.log("remove child", parentInstance, child);
    parentInstance.removeChild(child)
}

function removeChildFromContainer(parentInstance, child) {
    DEBUG && console.log("remove child from container", parentInstance, child);
    parentInstance.removeChild(child)
}

function insertBefore(parentInstance, child, beforeChild) {
    DEBUG && console.log("insertBefore");
    parentInstance.addChildBefore(child, beforeChild)
}

function insertInContainerBefore(parentInstance, child, beforeChild) {
    DEBUG && console.log("inertInContainerBefore");
    parentInstance.addChildBefore(child, beforeChild)
}

// TODO: what's the "updatePayload"?
function commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    DEBUG && console.log('instance, updatePayload', instance, updatePayload, type, oldProps, newProps)
    updateNativeComponent(instance, oldProps, newProps);
}

function commitMount(instance, updatePayload, type, oldProps, newProps) {
    DEBUG && console.log('commitMount')
}

function commitTextUpdate(textInstance, oldText, newText) {
    textInstance.text = newText;
    DEBUG && console.log('commitTextUpdate')
}

function clearContainer(container) {

}

function detachDeletedInstance(e) {
    //console.log("detachDeletedInstance", e);
    //e.remove();
}

function now() {
    return Date.now();
}

function scheduleDeferredCallback(callback) {
    return setTimeout(() => {
        callback({
            timeRemaining() {
                return Infinity
            },
        })
    })
}

export const DeftRenderer = Reconciler({
    appendInitialChild,

    createInstance,

    createTextInstance,

    finalizeInitialChildren,

    getPublicInstance,

    prepareForCommit,

    prepareUpdate,

    resetAfterCommit,

    getRootHostContext,

    getChildHostContext,

    shouldSetTextContent,

    scheduleDeferredCallback,

    shouldDeprioritizeSubtree,

    now,

    supportsMutation: true,

    appendChild,

    appendChildToContainer,

    commitMount,

    commitUpdate,

    insertBefore,

    insertInContainerBefore,

    removeChild,

    removeChildFromContainer,

    resetTextContent,

    commitTextUpdate,

    clearContainer,

    detachDeletedInstance,
})

export function render(window: Window, reactNode: ReactNode, deftElement ?: ContainerBasedElement, callback?: () => void): RenderHandle {
    deftElement = deftElement || window.body;
    //@ts-ignore
    let root = deftElement._reactRootContainer

    if (!root) {
        const newRoot = DeftRenderer.createContainer(deftElement)
        //@ts-ignore
        root = deftElement._reactRootContainer = newRoot
    }
    function destroy(done ?: () => void) {
        DeftRenderer.updateContainer(null, root, null, null);
        done?.();
    }
    function update(element: ReactNode, callback?: () => void) {
        const appRoot = React.createElement(PageRoot, {
            window,
            content: element,
            root: deftElement,
            destroy,
        });
        DeftRenderer.updateContainer(appRoot, root, null, callback);
    }

    update(reactNode, callback);

    return {
        update,
        destroy,
    }
}

