const path = require('path');
const {VueLoaderPlugin} = require("vue-loader");
const DeftWebpackPlugin = require("deft-webpack-plugin");

const deftOptions = {
    android: {
        appId: "fun.kason.deft_demo",
    }
};


const src = path.resolve(__dirname, 'ui');


module.exports = (env, argv) => {

    return {
        entry: {
            index: './ui/main.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
        },

        resolve: {
            alias: {
                "@": src
            },
            extensions: ['*', '.js', '.jsx', '.vue'],
        },
        // mode: argv.mode,
        devServer: {
            port: 7800,
            hot: true,
            client: {
                logging: "info",
                overlay: false,
            },
            allowedHosts: 'all',
        },
        plugins: [
            new VueLoaderPlugin(),
            new DeftWebpackPlugin(deftOptions),
        ],
        module: {
            rules: [{
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    compilerOptions: {
                        isCustomElement: DeftWebpackPlugin.isNativeComponent,
                    }
                },
                exclude: /node_modules/
            }, {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            }, {
                test: /\.(jpe?g|png|svg|gif)/i,
                // use: 'inline-loader',
                type: 'asset/inline',
                // type: 'asset/source',
            }]
        },
    }
}