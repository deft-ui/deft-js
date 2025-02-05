import React, {forwardRef} from "react";

export const Label = forwardRef<LabelElement, LabelElementProps>((props, ref) => {
    //@ts-ignore
    return <label ref={ref} {...props} />
});

export const Container = forwardRef<ContainerElement, ContainerElementProps>((props, ref) => {
    //@ts-ignore
    return <container {...props} ref={ref}/>
})

export const Row = forwardRef<ContainerElement, ContainerElementProps>((props, ref) => {
    const style = {
        ...props.style,
        flexDirection: 'row',
    }
    //@ts-ignore
    return <container {...props} style={style} ref={ref}/>
})

export const Button = forwardRef<ButtonElement, ButtonElementProps>((props, ref) => {
    const style = {
        padding: "2 10",
        borderRadius: 4,
        border: "1 #6E7175",
        background: "#31363B",
        ...props.style,
    }
    const hoverStyle = {
        border: "1 #3DAEE9",
        background: "#334E5E",
        ...props.hoverStyle,
    }
    const btnProps = {
        ...props,
        style,
        hoverStyle,
    }
    delete btnProps.title;

    //@ts-ignore
    return <button {...btnProps} ref={ref}>{props.children || props.title || ""}</button>
})

export const Entry = forwardRef<EntryElement, EntryElementProps>((props, ref) => {
    const ps = {
        ...props,
        style: {
            background: "#1B1E20",
            border: "1 #5E6164",
            padding: "1 4",
            ...props?.style,
        },
    }
    //@ts-ignore
    return <entry ref={ref} {...ps} />
});

export const Textedit = forwardRef<TextEditElement, TexteditElementProps>((props, ref) => {
    //@ts-ignore
    return <textedit ref={ref} {...props} />
});

export const TextEdit = Textedit;


export const Image = forwardRef<ImageElement, ImageElementProps>((props, ref) => {
    //@ts-ignore
    return <image {...props} ref={ref}/>
})

export const Scroll = forwardRef<ScrollElement, ScrollElementProps>((props, ref) => {
    //@ts-ignore
    return <scroll ref={ref} {...props} />
});

export const Paragraph = forwardRef<ParagraphElement, ParagraphElementProps>((props, ref) => {
    //@ts-ignore
    return <paragraph ref={ref} {...props} />
});