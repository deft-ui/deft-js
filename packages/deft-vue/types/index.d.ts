import {
    Container,
    Label,
    Button,
    Entry,
    Image,
    Scroll,
    Paragraph,
    RichText,
    TextInput,
    TextEdit,
    Checkbox,
    Radio,
    RadioGroup
} from './components'

export {}
declare module 'vue' {

    export interface GlobalComponents {
        Container: typeof Container,
        Label: typeof Label,
        Button: typeof Button,
        Entry: typeof Entry,
        Image: typeof Image,
        Scroll: typeof Scroll,
        Paragraph: typeof Paragraph,
        RichText: typeof RichText,
        TextInput: typeof TextInput,
        TextEdit: typeof TextEdit,
        Checkbox: typeof Checkbox,
        Radio: typeof Radio,
        RadioGroup: typeof RadioGroup,
    }
}
