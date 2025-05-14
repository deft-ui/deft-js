const fs = require("node:fs");

function ensureNdkDir() {
    const ndk = process.env.ANDROID_NDK_HOME;
    if (!ndk) {
        throw new Error('env ANDROID_NDK_HOME is not set');
    }
    return ndk;
}

function copyAndroidCxxShared(destDir) {
    const ndk = ensureNdkDir();
    const hostDirName = ensureHostDirName();
    const sysLibPath = `${ndk}/toolchains/llvm/prebuilt/${hostDirName}/sysroot/usr/lib/aarch64-linux-android/`
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


function getAndroidEnv() {
    const ext = process.platform === 'win32' ? '.exe' : '';
    const ndk = ensureNdkDir();
    const hostPlatform = ensureHostDirName();
    //TODO support x86_64?
    const sysTarget = 'aarch64-linux-android30';
    const rustEnvTarget = 'AARCH64_LINUX_ANDROID';

    function llvmBin(name) {
        return `${ndk}/toolchains/llvm/prebuilt/${hostPlatform}/bin/${name}${ext}`;
    }

    return {
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