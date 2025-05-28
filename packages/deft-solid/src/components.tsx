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
export const RichText = (props: RichTextElementProps) => {
    //@ts-ignore
    return <rich-text ref={ref} {...props} />
};
export const TextEdit = (props: TextEditElementProps) => {
    //@ts-ignore
    return <text-edit ref={ref} {...props} />
};
export const TextInput = (props: TextInputElementProps) => {
    //@ts-ignore
    return <text-input ref={ref} {...props} />
};
export const Checkbox = (props: CheckboxElementProps) => {
    //@ts-ignore
    return <checkbox ref={ref} {...props} />
};
export const Radio = (props: RadioElementProps) => {
    //@ts-ignore
    return <radio ref={ref} {...props} />
};
export const RadioGroup = (props: RadioGroupElementProps) => {
    //@ts-ignore
    return <radio-group ref={ref} {...props} />
};