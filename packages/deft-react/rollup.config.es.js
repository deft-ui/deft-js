import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import {getBabelOutputPlugin} from '@rollup/plugin-babel'

const path = require('path')

export default {
    input: {
        'deft-react': path.join(__dirname, `./src/index.tsx`),
    },
    external: (id, parent) =>
        /^react/.test(id) ||
        /^react-dom/.test(id) ||
        /^classnames/.test(id) ||
        /^@use-gesture/.test(id) ||
        /^@react-spring/.test(id) ||
        /^@bem-react/.test(id) ||
        (/^@\/packages\/\w+$/.test(id) && !!parent),
    output: {
        format: 'cjs',
        dir: './dist',
        name: '[entryName].js',
        paths: (id) => {
            return id
        },
    },
    plugins: [
        commonjs(),
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
