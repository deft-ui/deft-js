export function getRustTarget(platform) {
    return {
        "macos-amd64": "x86_64-apple-darwin",
        "macos-arm64": "aarch64-apple-darwin",
        "linux-amd64": "x86_64-unknown-linux-gnu",
        "linux-arm64": "aarch64-unknown-linux-gnu",
        "ohos-amd64": "x86_64-unknown-linux-ohos",
        "ohos-arm64": "aarch64-unknown-linux-ohos",
        "windows-amd64": "x86_64-pc-windows-msvc",
    }[platform]
}