const child_process = require('child_process');
const fs = require("node:fs");

function hasDir(dir) {
    try {
        const stat = fs.statSync(dir);
        return stat.isDirectory();
    }  catch (e) {
        return false;
    }
}

function copySoFiles(srcDir, destDir) {
    const files = fs.readdirSync(srcDir);
    for (const f of files) {
        if (f.endsWith('.so')) {
            fs.copyFileSync(srcDir + '/' + f, destDir + '/' + f);
        }
    }
}

function getOhosBuildCommand(arch) {
    const ohosDir = "ohos";
    return [
        () => {
            if (!fs.existsSync(ohosDir)) {
                throw new Error("ohos project not found! Please run 'deft init ohos' to initialize an ohos project");
            }
        },
        `ohrs build --release --arch ${arch} --dist target/ohos-dist`,
        () => {
            const dirName = {aarch: 'arm64-v8a'}[arch] || arch;
            const soDir = `target/ohos-dist/${dirName}`;
            const outDir = `ohos/entry/libs/${dirName}`;
            if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir, { recursive: true });
            }
            if (fs.existsSync(soDir)) {
                copySoFiles(soDir, outDir);
                console.log("\nPlease open ohos with DevEco Studio and run it manually\n");
            } else {
                console.error(`\nNo .so files found in ${soDir}.\n`);
            }
        }
    ]
}

class DeftWebpackPlugin {
    constructor(options) {
        const allOptions = {};
        const configFile = 'deft.config.json';
        if (fs.existsSync(configFile)) {
            Object.assign(allOptions, JSON.parse(fs.readFileSync(configFile, 'utf8')));
        }
        this.options = Object.assign(allOptions, options);
        /**
         *
         * @type {AbortController[]}
         */
        this.abortControllers = [];
        const previewActions = [{
            key: 'r',
            desc: 'run on this device',
            command: (options, callback) => this._runPlatform(options, "host", callback),
        }];
        if (hasDir("android")) {
            previewActions.push({
                key: 'a',
                desc: 'run on connected android device',
                command: (options, callback) => this._runPlatform(options,"android-arm64", callback),
            })
        }
        if (hasDir("ohos")) {
            previewActions.push({
                key: 'h',
                desc: 'build HarmonyOS app(arm64)',
                command: (options, callback) => this._runPlatform(options,"ohos-arm64", callback)
            });
            previewActions.push({
                key: 'e',
                desc: 'build HarmonyOS app(x86_64)',
                command: (options, callback) => this._runPlatform(options,"ohos-amd64", callback),
            });
        }
        previewActions.push({
            key: 'q',
            desc: 'quit',
            command: (_options, _callback) => process.exit(0),
        })
        this.previewActions = previewActions;
    }
    _displayMenus() {
        console.log("");
        console.log("==============================================");
        for (const pc of this.previewActions) {
            console.log(`Press ${pc.key} to ${pc.desc}`);
        }
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

    _getOhosRunCommand(port, arch) {
        // const appId = this.options.ohos?.appId;
        // if (!appId) {
        //     throw new Error("ohos.appId is missing");
        // }
        // const ability = this.options.ohos?.abilityId || "EntryAbility";
        return getOhosBuildCommand(arch);
    }

    _getOhosBuildCommand(arch) {
        return getOhosBuildCommand(arch);
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
            "ohos-amd64": this._getOhosRunCommand(port, "x86_64"),
            "ohos-arm64": this._getOhosRunCommand(port, "aarch"),
            "linux-amd64": this._getCargoCommand("run", "linux-amd64"),
            "linux-arm64": this._getCargoCommand("run", "linux-arm64"),
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
            "ohos-amd64": this._getOhosBuildCommand("x86_64"),
            "ohos-arm64": this._getOhosBuildCommand("aarch"),
            "linux-amd64": this._getCargoCommand("build", "linux-amd64"),
            "linux-arm64": this._getCargoCommand("build", "linux-arm64"),
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

    _runPlatform(options, platform, callback) {
        const {port} = options?.devServer || {};
        if (!port) {
            console.error("devServer.port is unspecified");
            process.exit(1);
        }
        const serverUrl = `http://localhost:${port}`
        const runCommands = Object.assign(this._getDefaultRunCommands(serverUrl, port), this.options.runCommands || {});
        const runTasks = runCommands[platform];
        if (!runTasks) {
            const availablePlatforms = Object.keys(runCommands).join(",");
            throw new Error(`unsupported dev platform: ${platform}, available platforms: ${availablePlatforms}`);
        }
        this._runCommands(runTasks, {
            env: {
                ...process.env,
                DEFT_JS_URL: serverUrl,
            },
        }).then(() => {
            callback();
        }).catch((error) => {
            console.error(error);
        });
    }

    async _runCommands(commands, options) {
        commands = [].concat(commands);
        for (const command of commands) {
            await this._runCmd(command, options);
        }
    }

    async _runCmd(cmd, options) {
        if (typeof cmd === "function") {
            cmd = cmd();
        }
        if (!cmd) {
            return;
        }
        return new Promise((resolve, reject) => {
            console.log(`Run command: ${cmd}`);
            const abortController = new AbortController();
            this.abortControllers.push(abortController);
            const result = child_process.spawn(cmd, {
                stdio: "inherit",
                cwd: ".",
                killSignal: "SIGKILL",
                signal: abortController.signal,
                shell: process.env.SHELL || true,
                ...options,
            });
            result.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Process exit with code: ${code}\n`));
                } else {
                    resolve();
                }
                const idx = this.abortControllers.indexOf(abortController);
                if (idx >= 0) {
                    this.abortControllers.splice(idx, 1);
                }
            });
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
        stdin.on('data', data => {
            if (data == "\u0003") {
                this._exit(1);
            }
            const action = this.previewActions.find(cmd => cmd.key === data);
            if (action) {
                action.command(options, () => {
                    this._displayMenus();
                })
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
            compiler.hooks.afterEmit.tapAsync('DeftWebpackPlugin', (compilation, callback) => {
                this._runCommands(cargoBuildCmd, {
                    env: {
                        ...process.env,
                        DEFT_JS_DIR: outputDir,
                    },
                }).then(() => {
                    callback();
                }).catch((error) => {
                    console.error(error);
                    console.error(`Build failed`);
                    process.exit(1);
                });
            });
        }
    }
}

DeftWebpackPlugin.isNativeComponent = (tag) => {
    return ["label", "button", "container", "entry", "scroll", "image", "paragraph"].includes(tag);
}

module.exports = DeftWebpackPlugin;