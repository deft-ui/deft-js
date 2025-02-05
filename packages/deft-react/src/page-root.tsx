import React, {ReactNode} from "react";
import {DeftWindow} from "./window";

export interface PageRootProps {
    window: DeftWindow,
    root: Element,
    content: ReactNode,
    destroy: (done ?: () => void) => void,
}

export const PageContext = React.createContext({
    root: null,
    window: null,
    destroy: null,
});

export default function PageRoot(props: PageRootProps) {
    return <PageContext.Provider value={{
        window: props.window,
        root: props.root,
        destroy: props.destroy,
    }}>
        {props.content}
    </PageContext.Provider>

}