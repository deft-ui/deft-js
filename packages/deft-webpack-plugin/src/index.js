const child_process = require('child_process');

class DeftWebpackPlugin {
    apply(compiler) {
        const isServe = process.env.WEBPACK_SERVE == "true";
        if (isServe) {
            const {port} = compiler.options?.devServer || {};
            if (!port) {
                console.error("devServer.port is unspecified");
                process.exit(1);
            }
            const serverUrl = `http://localhost:${port}`
            compiler.hooks.emit.tapAsync('DeftWebpackPlugin', (compilation, callback) => {
                let result = child_process.spawn('cargo', ['run'], {
                    env: {
                        ...process.env,
                        DEFT_JS_URL: serverUrl,
                    },
                    stdio: "inherit",
                    cwd: ".",
                });
                result.on('exit', () => {
                    process.exit(0);
                })
                callback();
            });
        } else {
            compiler.hooks.afterEmit.tapAsync('DeftWebpackPlugin', (compilation, callback) => {
                let result = child_process.spawn('cargo', ['build', '--release'], {
                    env: {
                        ...process.env,
                        DEFT_JS_URL: "dist",
                    },
                    stdio: "inherit",
                    cwd: ".",
                });
                result.on('exit', () => {
                    callback();
                });
            });
        }
    }
}

module.exports = DeftWebpackPlugin;