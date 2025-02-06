import * as child_process from "node:child_process";

function shell(dir, commands) {
    for (const cmd of commands) {
        child_process.spawnSync(cmd, {
            stdio: "inherit",
            cwd: dir,
            shell: true,
        })
    }
}

function updateTplDeps(dir) {
    shell(dir, [
        "npm i --save-dev deft-webpack-plugin",
    ]);
}

updateTplDeps("template-react");
updateTplDeps("template-react-ts");
updateTplDeps("template-vanilla");
updateTplDeps("template-vanilla-ts");
