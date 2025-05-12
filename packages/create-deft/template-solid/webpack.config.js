const path = require('path');
const DeftWebpackPlugin = require("deft-webpack-plugin");



module.exports = {
    entry: {
        index: './ui/index.jsx',
    },
    // target: 'node',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    }
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
        extensions: ['*', '.js', '.jsx'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new DeftWebpackPlugin(),
    ],
};