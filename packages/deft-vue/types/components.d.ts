declare interface DeftElementProps {
    autoFocus?: boolean,
    style?: StyleProps,
    hoverStyle?: StyleProps,
    cursor?: Cursor,
}

declare interface DeftElementEmits {
    click: (event: IMouseEvent) => void,
    mouseDown: (event: IMouseEvent) => void,
    mouseUp: (event: IMouseEvent) => void,
    mouseMove: (event: IMouseEvent) => void,
    mouseEnter: (event: IMouseEvent) => void,
    mouseLeave: (event: IMouseEvent) => void,
    keyDown:(event: IKeyEvent) => void,
    keyUp:(event: IKeyEvent) => void,
    mouseWheel: (event: IMouseWheelEvent) => void,
    contextMenu : (event: IMouseEvent) => void,
    touchStart: (event: ITouchEvent) => void,
    touchMove: (event: ITouchEvent) => void,
    touchEnd: (event: ITouchEvent) => void,
    touchCancel: (event: ITouchEvent) => void,
    focus: (event: IVoidEvent) => void,
    blur: (event: IVoidEvent) => void,
    focusShift: (event: IVoidEvent) => void,
    boundsChange : (event: IBoundsChangeEvent) => void,
}

type Comp<T, E> = import("vue").DefineComponent<
    {},
    {},
    {},
    {},
    {},
    import("vue").ComponentOptionsMixin,
    import("vue").ComponentOptionsMixin,
    DeftElementEmits & E,
    string,
    import("vue").VNodeProps,
    Readonly<T> & Readonly<DeftElementProps>,
    {},
    {},
    {},
    {},
    string,
    import("vue").ComponentProvideOptions,
    true,
    {},
    any
>;

declare type EntryType = "text" | "password"

export const Container: Comp<{}>
export const Label: Comp<{
    text?: string,
    align?: 'left' | 'center' | 'right'
}>
export const Button: Comp<{}>
export const Entry: Comp<{
    text?: string,
    multipleLine?: boolean,
    autoHeight?: boolean,
    rows?: number,
    type?: EntryType,
    placeholder?: string,
    placeholderStyle?: StyleProps,
}, {
    textChange: (event: ITextEvent) => void,
}>
export const Image: Comp<{
    src?: string,
}>
export const Scroll: Comp<{
    scrollY?: "auto" | "always" | "never",
    scrollX?: "auto" | "always" | "never",
}, {
    scroll: (event: IScrollEvent) => void,
}>
export const Paragraph: Comp<{}>