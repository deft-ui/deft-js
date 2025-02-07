import React, {ReactElement} from "react";
import {Container, Label, Row} from "../../components";
import {render} from "../../renderer";

export interface SelectProps<T> {
    value?: T;
    options?: OptionItem<T>[],
    onChange?: (value: T) => void,
}

export interface OptionItem<T> {
    label: string;
    value: T;
}

export interface MenuItem {
    label: string
    onClick?: () => void
}

interface DialogContentProps<R, P> {
    confirm(value: R);

    cancel();

    props: P;
}


function Menu(props: DialogContentProps<void, MenuItem[]>) {
    console.log('menus', props.props);
    const menuElList = props.props.map((it, idx) => {
        const onClick = (e) => {
            try {
                it.onClick && it.onClick();
            } finally {
                props.cancel();
            }
        }
        return <Container
            key={idx}
            style={{
                justifyContent: "center",
                padding: '2 12',
            }}
            hoverStyle={{
                background: "#334E5E",
            }}
            onClick={onClick}>{it.label}</Container>
    });
    const style = {
        padding: 0,
        color: "#FFF",
        border: "1 #4A4B4E",
    }
    return <Container style={style}>
        {menuElList}
    </Container>
}

function createPopup(contentElement: ContainerBasedElement, x, y, minWidth) {
    /*
    const dialogRoot = new ContainerElement();
    dialogRoot.setStyle({
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    })
    const bodyStyle: StyleProps = {
        background: '#444',
        position: 'absolute',
        left: x,
        top: y,
        minWidth,
    };

    function close() {
        contentElement.removeChild(dialogRoot);
    }

    dialogRoot.bindClick(() => {
        close();
    })
    return {
        render(root: ReactElement) {
            contentElement.addChild(dialogRoot);

            const dialogBody = new ContainerElement();
            dialogBody.setStyle(bodyStyle);
            dialogRoot.addChild(dialogBody);
            render(root, dialogBody);
        },
        close,
    }
     */
}


export function Select<T>(props: SelectProps<T>) {
    function onClick(e: IMouseEvent) {
        const options = props.options || [];
        const menus: MenuItem[] = options.map(it => ({
            label: it.label,
            onClick() {
                props.onChange?.(it.value);
            }
        }));
        let bounds = e.currentTarget.getBoundingClientRect();
        const rootElement = e.currentTarget.rootElement as ContainerBasedElement;
        const dlg = createPopup(rootElement, bounds.x, bounds.y + bounds.height, bounds.width);
        const root = React.createElement(Menu, {
            confirm(value: void) {
            },
            cancel() {

            },
            props: menus,
        });
        //TODO use popup
        // dlg.render(root);

    }

    const selectedOption = props.options.find(it => it.value === props.value);
    const displayValue = selectedOption?.label || "";
    const myStyle: StyleProps = {
        width: 100,
        border: '1 #666',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 6',
        borderRadius: 4,
    }
    return <Row style={myStyle} onClick={onClick}>
        {displayValue}
        <Label style={{
            width: 7, height: 7, borderLeft: '1 #aaa', borderTop: '1 #aaa',
            transform: 'rotate(-135deg)',
        }}/>
    </Row>
}