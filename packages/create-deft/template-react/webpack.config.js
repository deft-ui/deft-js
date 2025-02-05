const path = require('path');
const DeftWebpackPlugin = require("deft-webpack-plugin");

const deftPlatform = process.env.DEFT_PLATFORM || "host";

const androidRunCmd = [
    "cargo ndk -t arm64-v8a -o android/app/src/main/jniLibs/ -p 30  build",
    "cd android && ./gradlew assembleDebug",
    "adb install -t app/build/outputs/apk/debug/app-debug.apk",
    "adb reverse tcp:7800 tcp:7800",
    "adb shell am start fun.kason.deft_demo/deft_app.MainActivity"
].join(" && ");

const allRunCommand = {
    "android": androidRunCmd,
}
const allBuildCommand = {
    "android": "cargo ndk -t arm64-v8a -o android/app/src/main/jniLibs/ -p 30  build --release",
}
const deftOptions = {
    runCommand: allRunCommand[deftPlatform],
    buildCommand: allBuildCommand[deftPlatform],
};

module.exports = {
    entry: {
        index: './ui/main.jsx',
    },
    // target: 'node',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', {
                                runtime: 'automatic',
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|png|svg|gif)/i,
                // use: 'inline-loader',
                type: 'asset/inline',
                // type: 'asset/source',
            }
        ],
    },
    devServer: {
        port: 7800,
        hot: true,
        client: {
            logging: "info",
            overlay: false,
        },
        allowedHosts : 'all',
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        // libraryTarget: 'module',
        // chunkFormat: 'module',
    },
    plugins: [
        new DeftWebpackPlugin(deftOptions),
    ],
};