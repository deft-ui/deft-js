declare var console;
declare function setTimeout(callback, timeout ?: number): number;
declare function setInterval(callback, timeout ?: number): number;
declare var process: Process;
declare var navigator: Navigator;


declare type Cursor = "default" | "context-menu" | "help" | "pointer" | "progress"
    | "wait" | "cell" | "crosshair" | "text" | "vertical-text" | "alias" | "copy"
    | "move" | "no-drop" | "not-allowed" | "grab" | "grabbing" | "e-resize" | "n-resize"
    | "ne-resize" | "nw-resize" | "s-resize" | "se-resize" | "sw-resize" | "w-resize"
    | "ew-resize" | "ns-resize" | "nesw-resize" | "nwse-resize" | "col-resize"
    | "row-resize" | "all-scroll" | "zoom-in" | "zoom-out"

declare type EntryType = "text" | "password"