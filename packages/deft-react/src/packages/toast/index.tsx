import React, {useEffect} from "react";
import {Container} from "../../components";
import {DeftWindow} from "../../window";

export interface ToastProps {
    content: string;
    duration?: number;
    onEnded?: () => void;
}

export function Toast(props: ToastProps) {
    useEffect(() => {
        setTimeout(() => {
            console.log("Toast ended");
            props.onEnded?.();
        }, props.duration || 1000);
    }, []);
    console.log('showToast', props.content);
    return <Container style={{
        color: '#F9F9F9',
        position: 'absolute',
        left: '50%',
        top: '50%',
        background: '#393B40',
        padding: '8 12',
        transform: 'translate(-50%, -50%)',
        borderRadius: 8,
    }}>
        {props.content}
    </Container>
}

Toast.show = async function (window: DeftWindow, message: string): Promise<void> {
    //TODO remove wrapper style
    const wrapper = new ContainerElement();
    wrapper.setStyle({
        position: "absolute",
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    })

    return new Promise((resolve) => {
        let page = null;

        function onEnded() {
            resolve();
            page?.destroy();
        }

        page = window.newPage(<Toast content={message} onEnded={onEnded}/>);
    })
}