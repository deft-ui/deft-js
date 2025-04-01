import {Container, Label, Button, Entry, Image, Scroll, Paragraph} from './components'

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
    }
}
