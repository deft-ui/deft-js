import {render} from "./renderer";
import {ReactNode} from "react";
import {Toast, ToastOptions} from "./packages/toast";
import {Menu, MenuItem, MenuPosition} from "./packages/menu";

animation_create("deft-react-page-enter", {
    "0": {
        transform: "translate(100%, 0)",
    },
    "1": {
        transform: "translate(0, 0)",
    }
})

animation_create("deft-react-page-leave", {
    "0": {
        transform: "translate(0, 0)",
    },
    "1": {
        transform: "translate(100%, 0)",
    }
})

export interface PageOptions {
    style ?: StyleProps,
    leaveStyle ?: StyleProps,
}

export interface Page {
    update(element: ReactNode, done ?: () => void): void;
    destroy(done ?: () => void): void;
}

export class DeftWindow extends Window {
    #pages: Page[] = []

    constructor(props: WindowAttrs) {
        super(props);
        const onKeyUp= (e: IKeyEvent)=> {
            // console.log("onKeyUp", e);
            if (e.detail.key == "GoBack") {
                const pageCount = this.#pages.length;
                if (pageCount > 1) {
                    this.#pages[pageCount - 1].destroy();
                }
            }
        }
        this.body.bindKeyUp(onKeyUp);
    }

    toast(message: string, options?: ToastOptions) {
        return Toast.show(this, message, options);
    }

    showMenu(items: MenuItem[], position: MenuPosition) {
        Menu.show(this, items, position);
    }

    newPage(reactNode: ReactNode, options ?: PageOptions) {
        options = options || {};
        const pageEl = new ContainerElement();
        // pageEl.autoFocus = true;
        pageEl.style = {
            ...options.style,
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        };
        let page: Page;
        const close = () => {
            this.body.removeChild(pageEl);
            const pageIdx = this.#pages.indexOf(page);
            if (pageIdx > -1) {
                this.#pages.splice(pageIdx, 1);
            } else {
                console.log("page not found");
            }
        }
        this.body.addChild(pageEl);
        page = render(this, reactNode, pageEl, null, options.leaveStyle, close);
        this.#pages.push(page);
        return page;
    }

    getPages() {
        return this.#pages.slice();
    }

}