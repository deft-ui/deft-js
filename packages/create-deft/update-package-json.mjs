import fs from "node:fs";
import path from "node:path";

function generatePackageJson(isTs) {
    let tsDeps = "";
    if (isTs) {
        tsDeps = `"ts-loader": "^9.5.1",
    "typescript": "^5.4.5",`;
    }
    return `{
  "name": "deft-starter",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode development",
    "build:android": "cross-env DEFT_PLATFORM=android-arm64 webpack --mode development"
  },
  "dependencies": {
    "cross-env": "^7.0.3",
    "deft-react": "^0.3.0",
    "deft-sys": "^0.2.0",
    "react": "18.1.0",
    "react-reconciler": "0.28.0"
  },
  "devDependencies": {
    ${tsDeps}
    "@babel/preset-env": "^7.24.5",
    "@babel/preset-react": "^7.24.1",
    "@types/react": "^18.3.3",
    "babel-loader": "^9.1.3",
    "copy-webpack-plugin": "^12.0.2",
    "deft-webpack-plugin": "^0.1.6",
    "html-webpack-plugin": "^5.6.0",
    "webpack": "5.91.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "5.0.4"
  }
}`
}

function writePackageJson(dir, ts) {
    const file = path.resolve(dir, 'package.json');
    const content = generatePackageJson(ts);
    fs.writeFileSync(file, content);
}

writePackageJson("template-react", false);
writePackageJson("template-react-ts", true);
writePackageJson("template-vanilla", false);
writePackageJson("template-vanilla-ts", true);
