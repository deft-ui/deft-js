const child_process = require('child_process');

class DeftWebpackPlugin {
    constructor(options) {
        this.options = options || {};
        /**
         *
         * @type {AbortController[]}
         */
        this.abortControllers = [];
    }
    _displayMenus() {
        console.log("");
        console.log("==============================================");
        console.log("Press r to run on this device");
        console.log("Press a to run on connected android device");
        console.log("Press q to quit");
        console.log("==============================================");
    }

    _getAndroidRunCommand(port) {
        const appId = this.options.android?.appId;
        if (!appId) {
            throw new Error("android.appId is missing");
        }
        const activityId = this.options.android.activityId || "deft_app.MainActivity";
        return [
            "cargo ndk -t arm64-v8a -o android/app/src/main/jniLibs/ -p 30  build --release --features x11",
            "cd android && ./gradlew assembleDebug",
            "adb install -t app/build/outputs/apk/debug/app-debug.apk",
            `adb reverse tcp:${port} tcp:${port}`,
            `adb shell am start ${appId}/${activityId}`,
        ].join(" && ");
    }

    _getAndroidBuildCommand() {
        return [
            "cargo ndk -t arm64-v8a -o android/app/src/main/jniLibs/ -p 30  build --release --features x11",
            "cd android && ./gradlew assembleDebug", //TODO release build?
        ].join(" && ");
    }

    _getCargoCommand(cargoCmd, platform, features) {
        const targetMap = {
            "macos-amd64": "x86_64-apple-darwin",
            "macos-arm64": "aarch64-apple-darwin",
            "linux-amd64": "x86_64-unknown-linux-gnu",
            "linux-arm64": "aarch64-unknown-linux-gnu",
            "windows-amd64": "x86_64-pc-windows-msvc",
        }
        const target = targetMap[platform];
        if (!target) {
            throw new Error(`Unsupported platform: ${platform}`);
        }
        let cmd = `cargo ${cargoCmd} --release --target ${target}`;
        if (features) {
            cmd += " --features " + [].concat(features).join(",");
        }
        return cmd;
    }

    _getDefaultRunCommands(serverUrl, port) {
        const commands = {
            "android-arm64": this._getAndroidRunCommand(port),
            "linux-amd64": this._getCargoCommand("run", "linux-amd64", ["x11", "wayland"]),
            "linux-arm64": this._getCargoCommand("run", "linux-arm64", ["x11", "wayland"]),
            "windows-amd64": this._getCargoCommand("run", "windows-amd64"),
            "darwin-amd64": this._getCargoCommand("run", "macos-amd64"),
            "darwin-arm64": this._getCargoCommand("run", "macos-arm64"),
        }
        this._addHostPlatformCmd(commands);
        return commands;
    }

    _getDefaultBuildCommands() {
        const commands = {
            "android-arm64": this._getAndroidBuildCommand(),
            "linux-amd64": this._getCargoCommand("build", "linux-amd64", ["x11", "wayland"]),
            "linux-arm64": this._getCargoCommand("build", "linux-arm64", ["x11", "wayland"]),
            "windows-amd64": this._getCargoCommand("build", "windows-amd64"),
            "darwin-amd64": this._getCargoCommand("build", "macos-amd64"),
            "darwin-arm64": this._getCargoCommand("build", "macos-arm64"),
        }
        this._addHostPlatformCmd(commands);
        return commands;
    }

    _addHostPlatformCmd(commands) {
        const p = process.platform.replace("win32", "windows");
        const arch = process.arch.replace("x64", "amd64");
        const key = `${p}-${arch}`;
        if (commands[key]) {
            commands.host = commands[key];
        }
    }

    _parseCommand(cmd) {
        //TODO support quote char
        return cmd.split(" ");
    }

    _runPlatform(options, platform, callback) {
        const {port} = options?.devServer || {};
        if (!port) {
            console.error("devServer.port is unspecified");
            process.exit(1);
        }
        const serverUrl = `http://localhost:${port}`
        const runCommands = Object.assign(this._getDefaultRunCommands(serverUrl, port), this.options.runCommands || {});
        const cmd = runCommands[platform];
        if (!cmd) {
            const availablePlatforms = Object.keys(runCommands).join(",");
            throw new Error(`unsupported dev platform: ${platform}, available platforms: ${availablePlatforms}`);
        }
        console.log(`Run command: ${cmd}`);
        const abortController = new AbortController();
        this.abortControllers.push(abortController);
        const cmdAndArgs = this._parseCommand(cmd);
        const result = child_process.spawn(
            cmdAndArgs[0],
            cmdAndArgs.slice(1),
            {
                env: {
                    ...process.env,
                    DEFT_JS_URL: serverUrl,
                },
                stdio: "inherit",
                cwd: ".",
                killSignal: "SIGKILL",
                signal: abortController.signal,
            });
        result.on('exit', () => {
            try {
                callback && callback();
            } finally {
                const idx = this.abortControllers.indexOf(abortController);
                if (idx >= 0) {
                    this.abortControllers.splice(idx, 1);
                }
            }
        });
    }

    _exit(code) {
        for (const ac of this.abortControllers) {
            ac.abort();
        }
        process.exit(code);
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
            a: () => this._runPlatform(options,"android-arm64", runCallback),
            r: () => this._runPlatform(options,"host", runCallback),
            q: () => this._exit(0),
        }
        stdin.on('data', data => {
            if (data == "\u0003") {
                this._exit(1);
            }
            const action = actionMap[data];
            if (action) {
                action();
            } else {
                console.log("Unknown action: ", data);
                this._displayMenus();
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
            const buildCommands = Object.assign(this._getDefaultBuildCommands(), this.options.buildCommands || {});
            const cargoBuildCmd = buildCommands[platform];
            if (!cargoBuildCmd) {
                const availablePlatforms = Object.keys(buildCommands).join(",");
                throw new Error(`unsupported build platform: ${platform}, available build platforms: ${availablePlatforms}`);
            }
            console.log(`Build command: ${cargoBuildCmd}`);
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
                result.on('exit', (code) => {
                    if (code !== 0) {
                        console.error(`Build failed with exit code ${code}`);
                        process.exit(code);
                    } else {
                        callback();
                    }
                });
            });
        }
    }
}

DeftWebpackPlugin.isNativeComponent = (tag) => {
    return ["label", "button", "container", "entry", "scroll", "image", "paragraph"].includes(tag);
}

module.exports = DeftWebpackPlugin;