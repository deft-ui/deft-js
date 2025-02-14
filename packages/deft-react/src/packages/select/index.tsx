import React, {useContext} from "react";
import {Label, Row} from "../../components";
import {PageContext} from "../../page-root";
import {Popup} from "../popup";
import {Menu, MenuItem} from "../menu";

export interface SelectProps<T> {
    value?: T;
    options?: OptionItem<T>[],
    onChange?: (value: T) => void,
}

export interface OptionItem<T> {
    label: string;
    value: T;
}

export function Select<T>(props: SelectProps<T>) {
    const pageContext = useContext(PageContext);

    function onClick(e: IMouseEvent) {
        const options = props.options || [];
        const menus: MenuItem[] = options.map(it => ({
            label: it.label,
            onClick() {
                props.onChange?.(it.value);
            }
        }));


        let bounds = e.currentTarget.getBoundingClientRect();
        console.log("bounds", bounds);
        pageContext.window.newPage(
            <Popup x={bounds.x} y={bounds.y + bounds.height} overlayStyle={{background: '#0000'}}>
                <Menu items={menus} width={bounds.width} />
            </Popup>
        );
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