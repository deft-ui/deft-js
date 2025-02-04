const child_process = require('child_process');

class DeftWebpackPlugin {
    constructor(options) {
        this.options = options || {};
    }
    apply(compiler) {
        const isServe = process.env.WEBPACK_SERVE == "true";
        if (isServe) {
            const {port} = compiler.options?.devServer || {};
            if (!port) {
                console.error("devServer.port is unspecified");
                process.exit(1);
            }
            const serverUrl = `http://localhost:${port}`
            const cargoRunCmd = this.options.runCommand || "cargo run";
            compiler.hooks.emit.tapAsync('DeftWebpackPlugin', (compilation, callback) => {
                let result = child_process.spawn(cargoRunCmd, {
                    env: {
                        ...process.env,
                        DEFT_JS_URL: serverUrl,
                    },
                    stdio: "inherit",
                    cwd: ".",
                    shell: true,
                });
                result.on('exit', () => {
                    process.exit(0);
                })
                callback();
            });
        } else {
            const outputDir = compiler.options.output?.path;
            if (!outputDir) {
                console.error("output.path is unspecified");
                process.exit(1);
            }
            const cargoBuildCmd = this.options.buildCommand || "cargo build --release"
            compiler.hooks.afterEmit.tapAsync('DeftWebpackPlugin', (compilation, callback) => {
                let result = child_process.spawn(cargoBuildCmd, {
                    env: {
                        ...process.env,
                        DEFT_JS_DIR: outputDir,
                    },
                    stdio: "inherit",
                    cwd: ".",
                    shell: true,
                });
                result.on('error', () => {
                    process.exit(1);
                })
                result.on('exit', () => {
                    callback();
                });
            });
        }
    }
}

module.exports = DeftWebpackPlugin;