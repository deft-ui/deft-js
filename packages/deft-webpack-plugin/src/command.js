const {getRustTarget} = require("./config.js");
 function getCargoCommand(cargoCmd, platform, features) {
    const target = getRustTarget(platform);
    if (!target) {
        throw new Error(`Unsupported platform: ${platform}`);
    }
    let cmd = `cargo ${cargoCmd} --release --target ${target}`;
    if (features) {
        cmd += " --features " + [].concat(features).join(",");
    }
    return cmd;
}

module.exports = {
     getCargoCommand,
}