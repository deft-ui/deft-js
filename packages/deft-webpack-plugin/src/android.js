const fs = require("node:fs");
const {getRustEnvTarget} = require("./config");

function ensureSdkDir() {
    const ndk = process.env.ANDROID_HOME;
    if (!ndk) {
        throw new Error('env ANDROID_HOME is not set');
    }
    return ndk;
}

function ensureNdkDir() {
    const ndk = process.env.ANDROID_NDK_HOME;
    if (!ndk) {
        throw new Error('env ANDROID_NDK_HOME is not set');
    }
    return ndk;
}

function ensureSysDirName(platform) {
    const sysPath = {
        "android-arm64": "aarch64-linux-android",
        "android-amd64": "x86_64-linux-android"
    }[platform];
    if (!sysPath) {
        throw new Error('Unsupported platform: ' + platform);
    }
    return sysPath;
}

function copyAndroidCxxShared(destDir, platform) {
    const ndk = ensureNdkDir();
    const hostDirName = ensureHostDirName();
    const sysTargetName = ensureSysDirName(platform);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }
    const sysLibPath = `${ndk}/toolchains/llvm/prebuilt/${hostDirName}/sysroot/usr/lib/${sysTargetName}`;
    fs.copyFileSync(`${sysLibPath}/libc++_shared.so`, destDir + "/libc++_shared.so");
}

function ensureHostDirName() {
    const nameMap = {
        "linux": "linux-x86_64",
        "darwin": "darwin-x86_64",
        "win32": "windows-x86_64",
    }
    const name = nameMap[process.platform];
    if (!name) {
        throw new Error(`Unsupported host platform: ${process.platform}`);
    }
    return name;
}


function getAndroidEnv(platform) {
    const ext = process.platform === 'win32' ? '.exe' : '';
    const sdk = ensureSdkDir();
    const ndk = ensureNdkDir();
    const hostPlatform = ensureHostDirName();
    //TODO support custom api version?
    const sysTarget = ensureSysDirName(platform) + "30";
    const rustEnvTarget = getRustEnvTarget(platform);

    function llvmBin(name) {
        return `${ndk}/toolchains/llvm/prebuilt/${hostPlatform}/bin/${name}${ext}`;
    }

    const binPaths = [
        `${sdk}/platform-tools`,
        process.env.PATH,
    ].join(process.platform === 'win32' ? ";" : ":");

    return {
        PATH: binPaths,
        "LIBCLANG_PATH": `${ndk}/toolchains/llvm/prebuilt/${hostPlatform}/lib`,
        "CLANG_PATH": llvmBin('clang++'),
        [`CXXSTDLIB_${rustEnvTarget}`]: "c++",
        "TARGET_CC": llvmBin('clang'),
        "TARGET_CXX": llvmBin('clang++'),
        "TARGET_AR": llvmBin('llvm-ar'),
        "TARGET_OBJDUMP": llvmBin('llvm-objdump'),
        "TARGET_OBJCOPY": llvmBin('llvm-objcopy'),
        "TARGET_NM": llvmBin('llvm-nm'),
        "TARGET_AS": llvmBin('llvm-as'),
        "TARGET_LD": llvmBin('ld.lld'),
        "TARGET_RANLIB": llvmBin('llvm-ranlib'),
        "TARGET_STRIP": llvmBin('llvm-strip'),
        [`CARGO_TARGET_${rustEnvTarget}_LINKER`]: llvmBin('clang'),
        "CARGO_ENCODED_RUSTFLAGS": `-Clink-args=--target=${sysTarget} --sysroot=${ndk}/toolchains/llvm/prebuilt/${hostPlatform}/sysroot`,
    }
}

module.exports = {
    copyAndroidCxxShared,
    getAndroidEnv,
};