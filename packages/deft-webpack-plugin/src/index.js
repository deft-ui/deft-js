const child_process = require('child_process');
const fs = require("node:fs");
const colors = require("picocolors");

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

function ensureOhosNdkPath() {
    const sdk = process.env.OHOS_SDK_HOME || process.env.OHOS_NDK_HOME;
    if (!sdk) {
        throw new Error('Missing OHOS_NDK_HOME environment');
    }
    return sdk;
}

function copyCxxShared(target, destDir) {
    const ndkDir = ensureOhosNdkPath();
    const soFile = `${ndkDir}/native/llvm/lib/${target}/libc++_shared.so`;
    fs.copyFileSync(soFile, destDir + "/libc++_shared.so");
}

function getOhosEnv() {
    const sdk = ensureOhosNdkPath();
    const devDcoHome = process.env.DEVECO_HOME;
    if (!devDcoHome) {
        throw new Error("Missing DEVECO_HOME environment");
    }
    const ext = process.platform === 'win32' ? '.exe' : '';
    const ndk = `${sdk}/native`
    const binPaths = [
        `${devDcoHome}/jbr/bin`,
        `${ndk}/llvm/bin`,
        `${sdk}/toolchains`,
        `${devDcoHome}/tools/ohpm/bin`,
        `${devDcoHome}/tools/hvigor/bin`,
        process.env.Path,
    ].join(process.platform === 'win32' ? ";" : ":");

    return {
        "DEVECO_SDK_HOME": `${devDcoHome}/sdk`,
        "Path": binPaths,
        "LIBCLANG_PATH": `${ndk}/llvm/lib`,
        "CLANG_PATH": `${ndk}/llvm/bin/clang++${ext}`,
        "CXXSTDLIB_X86_64_UNKNOWN_LINUX_OHOS": "c++",
        "TARGET_CC": `${ndk}/llvm/bin/clang${ext}`,
        "TARGET_CXX": `${ndk}/llvm/bin/clang++${ext}`,
        "TARGET_AR": `${ndk}/llvm/bin/llvm-ar${ext}`,
        "TARGET_OBJDUMP": `${ndk}/llvm/bin/llvm-objdump${ext}`,
        "TARGET_OBJCOPY": `${ndk}/llvm/bin/llvm-objcopy${ext}`,
        "TARGET_NM": `${ndk}/llvm/bin/llvm-nm${ext}`,
        "TARGET_AS": `${ndk}/llvm/bin/llvm-as${ext}`,
        "TARGET_LD": `${ndk}/llvm/bin/ld.lld${ext}`,
        "TARGET_RANLIB": `${ndk}/llvm/bin/llvm-ranlib${ext}`,
        "TARGET_STRIP": `${ndk}/llvm/bin/llvm-strip${ext}`,
        "CARGO_TARGET_X86_64_UNKNOWN_LINUX_OHOS_LINKER": `${ndk}/llvm/bin/clang${ext}`,
        "CARGO_ENCODED_RUSTFLAGS": `-Clink-args=--target=x86_64-linux-ohos --sysroot=${ndk}/sysroot -D__MUSL__`,
    }
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
                desc: 'run on the connected android device(arm64)',
                command: (options, callback) => this._runPlatform(options,"android-arm64", callback),
            })
        }
        if (hasDir("ohos")) {
            previewActions.push({
                key: 'h',
                desc: 'run on the connected HarmonyOS device(arm64)',
                command: (options, callback) => this._runPlatform(options,"ohos-arm64", callback)
            });
            previewActions.push({
                key: 'e',
                desc: 'run on the connected HarmonyOS device(x86_64)',
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
        console.log("----------------------------------------------------------");
        for (const pc of this.previewActions) {
            console.log(`Press ${colors.green(pc.key)} to ${pc.desc}`);
        }
        console.log("----------------------------------------------------------");
    }

    _getOhosBuildCommand(platform) {
        const ohosDir = "ohos";
        const sysTarget = {
            "ohos-amd64": "x86_64-linux-ohos",
            "ohos-arm64": "aarch64-linux-ohos",
        }[platform];
        const soDir = {
            "ohos-amd64": "target/x86_64-unknown-linux-ohos/release",
            "ohos-arm64": "target/aarch64-unknown-linux-ohos/release",
        }[platform];
        const outDir = {
            "ohos-amd64": "ohos/entry/libs/x86_64",
            "ohos-arm64": "ohos/entry/libs/arm64-v8a",
        }[platform];
        if (!soDir || !outDir) {
            console.error("Unsupported platform", platform);
            return [];
        }
        const command = [
            "cd ohos",
            "ohpm install",
            "hvigorw --mode module -p module=entry@default -p product=default -p requiredDeviceType=phone assembleHap",
        ].join(" && ");
        return [
            () => {
                if (!fs.existsSync(ohosDir)) {
                    throw new Error("ohos project not found! Please run 'deft init ohos' to initialize an ohos project");
                }
            },
            {
                env: getOhosEnv(),
                command: this._getCargoCommand("build", platform),
            },
            () => {
                if (!fs.existsSync(outDir)) {
                    fs.mkdirSync(outDir, { recursive: true });
                }
                if (fs.existsSync(soDir)) {
                    copySoFiles(soDir, outDir);
                    copyCxxShared(sysTarget, outDir);
                } else {
                    console.error(`\nNo .so files found in ${soDir}.\n`);
                }
            },
            {
                env: getOhosEnv(),
                command,
            }
        ]
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
        const appId = this.options.ohos?.appId;
        if (!appId) {
            throw new Error("ohos.appId is missing");
        }
        const ability = this.options.ohos?.abilityId || "EntryAbility";
        const env = getOhosEnv();
        const command = [
            "hdc app install -r ohos/entry/build/default/outputs/default/entry-default-unsigned.hap",
            `hdc rport tcp:${port} tcp:${port}`,
            `hdc shell aa force-stop ${appId}`,
            `hdc shell aa start -a ${ability} -b ${appId}`,
        ].join(" && ");
        return this._getOhosBuildCommand(arch).concat([{ env, command }]);
    }

    _getCargoCommand(cargoCmd, platform, features) {
        const targetMap = {
            "macos-amd64": "x86_64-apple-darwin",
            "macos-arm64": "aarch64-apple-darwin",
            "linux-amd64": "x86_64-unknown-linux-gnu",
            "linux-arm64": "aarch64-unknown-linux-gnu",
            "ohos-amd64": "x86_64-unknown-linux-ohos",
            "ohos-arm64": "aarch64-unknown-linux-ohos",
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
            "ohos-amd64": this._getOhosRunCommand(port, "ohos-amd64"),
            "ohos-arm64": this._getOhosRunCommand(port, "ohos-arm64"),
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
            "ohos-amd64": this._getOhosBuildCommand("ohos-amd64"),
            "ohos-arm64": this._getOhosBuildCommand("ohos-arm64"),
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
        let cmdEnv = {};
        if (typeof cmd === "object") {
            if (!cmd.command) {
                return;
            }
            cmdEnv = cmd.env;
            cmd = cmd.command;
        }
        return new Promise((resolve, reject) => {
            console.log(`Run command: ${cmd}`);
            const abortController = new AbortController();
            this.abortControllers.push(abortController);
            const spawnOptions = {
                stdio: "inherit",
                cwd: ".",
                killSignal: "SIGKILL",
                signal: abortController.signal,
                shell: process.env.SHELL || true,
                ...options,
            };
            spawnOptions.env = Object.assign(spawnOptions.env || {}, cmdEnv);
            const result = child_process.spawn(cmd, spawnOptions);
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