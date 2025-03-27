export const Label = (props: LabelElementProps) => {
    //@ts-ignore
    return <label {...props} />
};

export const Container = (props: ContainerElementProps) => {
    //@ts-ignore
    return <container {...props} />
}

export const Row = (props: ContainerElementProps) => {
    const style = {
        ...props.style,
        flexDirection: 'row',
    }
    //@ts-ignore
    return <container {...props} style={style}/>
}

export const Button = (props: ButtonElementProps) => {
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
    return <button {...btnProps} >{props.children || props.title || ""}</button>
}

export const Entry = (props: EntryElementProps) => {
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
    return <entry {...ps} />
}

export const Textedit = (props: TexteditElementProps) => {
    //@ts-ignore
    return <textedit {...props} />
}

export const TextEdit = Textedit;


export const Image = (props: ImageElementProps) => {
    //@ts-ignore
    return <image {...props}/>
}

export const Scroll = (props: ScrollElementProps) => {
    //@ts-ignore
    return <scroll {...props} />
};

export const Paragraph = (props: ParagraphElementProps) => {
    //@ts-ignore
    return <paragraph {...props} />
}