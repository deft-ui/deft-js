import typescript from '@rollup/plugin-typescript'
import {getBabelOutputPlugin} from '@rollup/plugin-babel'

const path = require('path')

export default {
    input: {
        'deft-solid': path.join(__dirname, `./src/index.ts`),
    },
    external: (id, parent) =>
        /^solid-js/.test(id) ||
        (/^@\/packages\/\w+$/.test(id) && !!parent),
    output: {
        format: 'esm',
        dir: './dist',
        name: '[entryName].js',
        paths: (id) => {
            return id
        },
    },
    plugins: [
        typescript(),
        getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
            plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-syntax-dynamic-import',
            ],
        }),
    ],
}
