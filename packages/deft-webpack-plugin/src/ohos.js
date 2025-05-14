const fs = require("node:fs");
const {getRustTarget} = require("./config.js");
const {copySoFiles} = require("./utils");

function ensureOhosSdkPath() {
    const sdk = process.env.OHOS_SDK_HOME;
    if (!sdk) {
        throw new Error('Missing OHOS_SDK_HOME environment');
    }
    return sdk;
}

function copyCxxShared(target, destDir) {
    const sdk = ensureOhosSdkPath();
    const soFile = `${sdk}/native/llvm/lib/${target}/libc++_shared.so`;
    fs.copyFileSync(soFile, destDir + "/libc++_shared.so");
}

function getOhosSysTarget(platform) {
    return {
        "ohos-amd64": "x86_64-linux-ohos",
        "ohos-arm64": "aarch64-linux-ohos",
    }[platform];
}

function getOhosEnv(platform) {
    const sysTarget = getOhosSysTarget(platform);
    const rustEnvTarget = getRustTarget(platform).replace(/-/g, '_').toUpperCase();
    const sdk = ensureOhosSdkPath();
    const devDcoHome = process.env.DEVECO_HOME;
    if (!devDcoHome) {
        throw new Error("Missing DEVECO_HOME environment");
    }
    const ext = process.platform === 'win32' ? '.exe' : '';
    const ndk = `${sdk}/native`
    const javaHome = process.platform === "darwin" ? `${devDcoHome}/jbr/Contents/Home` : `${devDcoHome}/jbr`;
    const binPaths = [
        `${javaHome}/bin`,
        `${ndk}/llvm/bin`,
        `${sdk}/toolchains`,
        `${devDcoHome}/tools/ohpm/bin`,
        `${devDcoHome}/tools/hvigor/bin`,
        process.env.PATH,
    ].join(process.platform === 'win32' ? ";" : ":");

    return {
        OHOS_NDK_HOME: sdk,
        NODE_HOME: `${devDcoHome}/tools/node`,
        JAVA_HOME: javaHome,
        DEVECO_SDK_HOME: `${devDcoHome}/sdk`,
        PATH: binPaths,
        "LIBCLANG_PATH": `${ndk}/llvm/lib`,
        "CLANG_PATH": `${ndk}/llvm/bin/clang++${ext}`,
        [`CXXSTDLIB_${rustEnvTarget}`]: "c++",
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
        [`CARGO_TARGET_${rustEnvTarget}_LINKER`]: `${ndk}/llvm/bin/clang${ext}`,
        "CARGO_ENCODED_RUSTFLAGS": `-Clink-args=--target=${sysTarget} --sysroot=${ndk}/sysroot -D__MUSL__`,
    }
}

function distOhos(platform) {
    const soDir = {
        "ohos-amd64": "target/x86_64-unknown-linux-ohos/release",
        "ohos-arm64": "target/aarch64-unknown-linux-ohos/release",
    }[platform];
    const outDir = {
        "ohos-amd64": "ohos/entry/libs/x86_64",
        "ohos-arm64": "ohos/entry/libs/arm64-v8a",
    }[platform];
    if (fs.existsSync(soDir)) {
        copySoFiles(soDir, outDir);
        copyCxxShared(getOhosSysTarget(platform), outDir);
    } else {
        console.error(`\nNo .so files found in ${soDir}.\n`);
    }
}

module.exports = {
    getOhosEnv,
    distOhos,
}