import React, {useContext} from "react";
import {PageContext} from "../../page-root";
import {Container} from "../../components";

export type PopupOrigin = 'LeftTop' | 'LeftBottom' | 'RightTop' | 'RightBottom';

export interface PopupProps {
    origin ?: PopupOrigin,
    x?: number,
    y?: number,
    children: React.ReactNode;
    overlayStyle ?: StyleProps,
    //TODO support direction
}

export function Popup(props: PopupProps) {
    const pageContext = useContext(PageContext);

    function close() {
        pageContext.destroy();
    }
    let transform = 'translate(0, 0)';
    switch (props.origin) {
        case 'LeftBottom':
            transform = 'translate(0, -100%)';
            break;
        case 'RightTop':
            transform = 'translate(-100%, 0)';
            break;
        case 'RightBottom':
            transform = 'translate(-100%, -100%)';
    }

    return <Container onClick={close} style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#0007',
        ...props.overlayStyle,
    }}>
        <Container style={{
            position: 'absolute',
            left: props.x,
            top: props.y,
            transform,
        }}>
            {props.children}
        </Container>
    </Container>
}