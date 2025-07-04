declare var console;
declare function setTimeout(callback, timeout ?: number): number;
declare function setInterval(callback, timeout ?: number): number;
declare var process: Process;
declare var navigator: Navigator;

declare interface RenderHandle {
    update(element: any, callback: () => void): void;

    destroy(callback: () => void): void;
}

declare type Cursor = "default" | "context-menu" | "help" | "pointer" | "progress"
    | "wait" | "cell" | "crosshair" | "text" | "vertical-text" | "alias" | "copy"
    | "move" | "no-drop" | "not-allowed" | "grab" | "grabbing" | "e-resize" | "n-resize"
    | "ne-resize" | "nw-resize" | "s-resize" | "se-resize" | "sw-resize" | "w-resize"
    | "ew-resize" | "ns-resize" | "nesw-resize" | "nwse-resize" | "col-resize"
    | "row-resize" | "all-scroll" | "zoom-in" | "zoom-out"

declare type EntryType = "text" | "password"

declare interface DeftElementProps {
    onClick?: (event: IMouseEvent) => void,
    onMouseDown?: (event: IMouseEvent) => void,
    onMouseUp?: (event: IMouseEvent) => void,
    onMouseMove?: (event: IMouseEvent) => void,
    onMouseEnter?: (event: IMouseEvent) => void,
    onMouseLeave?: (event: IMouseEvent) => void,
    onKeyDown?:(event: IKeyEvent) => void,
    onKeyUp?:(event: IKeyEvent) => void,
    onMouseWheel?: (event: IMouseWheelEvent) => void,
    onContextMenu ?: (event: IMouseEvent) => void,
    onTouchStart?: (event: ITouchEvent) => void,
    onTouchMove?: (event: ITouchEvent) => void,
    onTouchEnd?: (event: ITouchEvent) => void,
    onTouchCancel?: (event: ITouchEvent) => void,
    onFocus?: (event: IVoidEvent) => void,
    onBlur?: (event: IVoidEvent) => void,
    onFocusShift?: (event: IVoidEvent) => void,
    onBoundsChange?: (event: IBoundsChangeEvent) => void,

    className ?: string,
    autoFocus ?: boolean,
    style?: StyleProps,
    hoverStyle?: StyleProps,
    cursor?: Cursor,
}

declare interface LabelElementProps extends DeftElementProps {
    text?: string,
    selection ?: number[],
}

declare interface ButtonElementProps extends DeftElementProps {
    title ?: string,
    children?: React.ReactNode,
    disabled?: boolean,
}


declare interface ContainerElementProps extends DeftElementProps {
    children?: React.ReactNode,
}

declare interface EntryElementProps extends DeftElementProps {
    onCaretChange?: (event: ICaretEvent) => void,
    onTextChange?: (event: ITextEvent) => void,
    text?: string,
    multipleLine ?: boolean,
    autoHeight ?: boolean,
    rows ?: number,
    type ?: EntryType,
    placeholder?: string,
}

declare interface ImageElementProps extends DeftElementProps {
    src: string,
}

declare interface ScrollElementProps extends ContainerElementProps {
    onScroll?: (event: IScrollEvent) => void,
    scrollY ?: "auto"|"always"|"never",
    scrollX ?: "auto"|"always"|"never",
}

declare interface ParagraphElementProps extends DeftElementProps {

}

declare interface RichTextElementProps extends DeftElementProps {

}

declare interface CheckboxElementProps extends DeftElementProps {
    label ?: string,
    checked ?: boolean,
    disabled ?: boolean,
    onChange?: (event: IVoidEvent) => void,
}

declare interface RadioElementProps extends DeftElementProps {
    label ?: string,
    checked ?: boolean,
    disabled ?: boolean,
    onChange?: (event: IVoidEvent) => void,
}

declare interface RadioGroupElementProps extends DeftElementProps {

}

declare interface SelectElementProps extends DeftElementProps {
    value ?: string,
    options?: SelectOption[],
    placeholder?: string,
    disabled?: boolean,
    onChange?: (event: IVoidEvent) => void,
}

declare interface TextInputElementProps extends DeftElementProps {
    text ?: string,
    placeholder?: string,
    type ?: EntryType,
    disabled ?: boolean,
    onCaretChange?: (event: ICaretEvent) => void,
    onTextChange?: (event: ITextEvent) => void,
}

declare interface TextEditElementProps extends DeftElementProps {
    text ?: string,
    placeholder?: string,
    disabled ?: boolean,
    onCaretChange?: (event: ICaretEvent) => void,
    onTextChange?: (event: ITextEvent) => void,
}