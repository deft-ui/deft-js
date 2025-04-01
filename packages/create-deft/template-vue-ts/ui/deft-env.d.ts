/// <reference types="deft-sys" />
/// <reference types="deft-vue/types/index" />

declare const console;

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}