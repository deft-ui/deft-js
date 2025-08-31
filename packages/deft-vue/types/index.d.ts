import {
    Container,
    Label,
    Button,
    Image,
    Scroll,
    RichText,
    TextInput,
    TextEdit,
    Checkbox,
    Radio,
    RadioGroup,
    Select,
} from './components'

export {}
declare module 'vue' {

    export interface GlobalComponents {
        Container: typeof Container,
        Label: typeof Label,
        Button: typeof Button,
        Image: typeof Image,
        Scroll: typeof Scroll,
        RichText: typeof RichText,
        TextInput: typeof TextInput,
        TextEdit: typeof TextEdit,
        Checkbox: typeof Checkbox,
        Radio: typeof Radio,
        RadioGroup: typeof RadioGroup,
        Select: typeof Select,
    }
}
