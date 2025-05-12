const path = require('path');
const DeftWebpackPlugin = require("deft-webpack-plugin");



module.exports = {
    entry: {
        index: './ui/index.tsx',
    },
    // target: 'node',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [ 'deft-style-loader', 'css-loader', 'postcss-loader']
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
    },
    plugins: [
        new DeftWebpackPlugin(),
    ],
};