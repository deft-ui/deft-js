const fs = require("node:fs");

function copySoFiles(srcDir, destDir) {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    const files = fs.readdirSync(srcDir);
    for (const f of files) {
        if (f.endsWith('.so')) {
            fs.copyFileSync(srcDir + '/' + f, destDir + '/' + f);
        }
    }
}

module.exports = {
    copySoFiles,
}