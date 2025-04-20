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
    const btnProps = {
        ...props,
    }
    delete btnProps.title;

    //@ts-ignore
    return <button {...btnProps} >{props.children || props.title || ""}</button>
}

export const Entry = (props: EntryElementProps) => {
    //@ts-ignore
    return <entry {...props} />
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