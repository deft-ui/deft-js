const child_process = require('child_process');

class DeftWebpackPlugin {
    constructor(options) {
        this.options = options || {};
    }
    _displayMenus() {
        console.log("");
        console.log("==============================================");
        console.log("Press r to run on this device");
        console.log("Press a to run on connected android device");
        console.log("==============================================");
    }

    _getAndroidRunCommand(port) {
        const appId = this.options.android?.appId;
        if (!appId) {
            throw new Error("android.appId is missing");
        }
        const activityId = this.options.android.activityId || "deft_app.MainActivity";
        return [
            "cargo ndk -t arm64-v8a -o android/app/src/main/jniLibs/ -p 30  build --release",
            "cd android && ./gradlew assembleDebug",
            "adb install -t app/build/outputs/apk/debug/app-debug.apk",
            `adb reverse tcp:${port} tcp:${port}`,
            `adb shell am start ${appId}/${activityId}`,
        ].join(" && ");
    }

    _getAndroidBuildCommand() {
        return [
            "cargo ndk -t arm64-v8a -o android/app/src/main/jniLibs/ -p 30  build --release",
            "cd android && ./gradlew assembleDebug", //TODO release build?
        ].join(" && ");
    }

    _getDefaultRunCommand(platform, serverUrl, port) {
        switch (platform) {
            case "android":
                return this._getAndroidRunCommand(port);
            case "host":
                return "cargo run";
            default:
                throw new Error(`unsupported platform: ${platform}`);
        }
    }

    _getDefaultBuildCommand(platform) {
        switch (platform) {
            case "android":
                return this._getAndroidBuildCommand();
            case "host":
                return "cargo build --release"
            default:
                throw new Error(`unsupported platform: ${platform}`);
        }
    }

    _runPlatform(options, platform, callback) {
        const {port} = options?.devServer || {};
        if (!port) {
            console.error("devServer.port is unspecified");
            process.exit(1);
        }
        const serverUrl = `http://localhost:${port}`
        const runCommands = this.options.runCommands || {};
        const cmd = runCommands[platform] || this._getDefaultRunCommand(platform, serverUrl, port);
        const result = child_process.spawn(cmd, {
            env: {
                ...process.env,
                DEFT_JS_URL: serverUrl,
            },
            stdio: "inherit",
            cwd: ".",
            shell: true,
        });
        result.on('exit', callback);
    }

    _initOnce(options) {
        if (this._initialized) {
            return;
        }
        this._initialized = true;
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        const runCallback = () => {
            this._displayMenus();
        }
        const actionMap = {
            a: () => this._runPlatform(options,"android", runCallback),
            p: () => this._runPlatform(options,"host", runCallback),
        }
        stdin.on('data', data => {
            if (data == "\u0003") {
                process.exit(1);
            }
            const action = actionMap[data];
            if (action) {
                action();
            } else {
                console.log("Unknown action: ", action);
            }
        });
    }
    apply(compiler) {
        const isServe = process.env.WEBPACK_SERVE == "true";
        if (isServe) {
            compiler.hooks.done.tapAsync('DeftWebpackPlugin', (compilation, callback) => {
                this._initOnce(compiler.options);
                callback();
                setTimeout(() => {
                    this._displayMenus();
                }, 200)
            });
        } else {
            const outputDir = compiler.options.output?.path;
            if (!outputDir) {
                console.error("output.path is unspecified");
                process.exit(1);
            }
            const platform = process.env.DEFT_PLATFORM || "host";
            const buildCommands = this.options.buildCommands || {};
            const cargoBuildCmd = buildCommands[platform] || this._getDefaultBuildCommand(platform);
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