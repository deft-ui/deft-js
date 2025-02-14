import React, {useContext} from "react";
import {PageContext} from "../../page-root";
import {Container} from "../../components";
import {Popup, PopupOrigin} from "../popup";
import {DeftWindow} from "../../window";

export interface MenuItem {
    label: string
    onClick?: () => void
}

export interface MenuProps {
    items: MenuItem[];
    width ?: number;
}

export interface MenuPosition {
    origin?: PopupOrigin,
    target?: Element,
    x?: number,
    y?: number,
}

export function Menu(props: MenuProps) {
    // console.log('menus', props.props);
    const pageContext = useContext(PageContext);
    const menuElList = props.items.map((it, idx) => {
        const onClick = () => {
            try {
                it.onClick && it.onClick();
            } finally {
                pageContext.destroy();
            }
        }
        return <Container
            key={idx}
            style={{
                borderTop: idx == 0 ? "none" : "1 #373737",
                justifyContent: "center",
                // flex: 1,
                padding: '8 12',
                background: '#2C2C2C',
            }}
            hoverStyle={{
                background: "#334E5E",
            }}
            onClick={onClick}>{it.label}</Container>
    });
    const style = {
        padding: 0,
        color: "#FFF",
        border: '1 #373737',
        width: props.width,
    }
    return <Container style={style}>
        {menuElList}
    </Container>
}

Menu.show = function (window: DeftWindow, menus: MenuItem[], pos: MenuPosition) {
    let x = pos.x;
    let y = pos.y;
    if (x == null && y == null) {
        const rect = pos.target.getBoundingClientRect();
        x = rect?.x;
        y = rect?.y;
    }
    x = x || 0;
    y = y || 0;
    console.log({x, y})
    const menuPopup = <Popup x={x} y={y} origin={pos.origin || 'LeftTop'}>
        <Menu items={menus}/>
    </Popup>
    window.newPage(menuPopup);
}
