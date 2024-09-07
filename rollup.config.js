import path from 'path';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import postcssUrl from 'postcss-url';

const production = !process.env.ROLLUP_WATCH;
const __dirname = import.meta.dirname;

const realPath = (name) => {
    return  path.resolve(__dirname, path.resolve('front/javascripts', name));
}
  
export default {
    input: {
        common: realPath('common.js'),
        home: realPath('home.js'),
        accounts: realPath('accounts.js'),
        journal: realPath('journal.js'),
        ledger: realPath('ledger.js'),
        trial_balance: realPath('trial-balance.js'),
        customer: realPath('customer.js'),
        voucher: realPath('voucher.js'),
        'bank-ledger': realPath('bank-ledger.js'),
        index: realPath('index.js'),
        changes: realPath('changes.js'),
/*
        setup: realPath('setup.js')
*/
    },
    output: {
        dir: 'dist',
        format: 'es',
        sourcemap: true,
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css')) {
              return '[name].[ext]';  // CSSファイルを/dist/直下に配置
            }
            return 'assets/[name].[ext]';  // 他のファイルは/assets/に配置
          }
    },
    plugins: [
        svelte({
            compilerOptions: {
                dev: process.env.NODE_ENV !== 'production'
            }
        }),
        resolve({
            browser: true,
            dedupe: ['svelte'],
            preferBuiltins: false
        }),
        commonjs(),
        postcss({
            plugins: [
                postcssUrl({
                    url: (asset) => {
                        if (asset.url.includes('webfonts')) {
                            return `/dist/assets/${path.basename(asset.url)}`;
                        }
                        return asset.url;
                    },
                    assetsPath: 'dist/assets/webfonts', // コピー先を明示
                    useHash: false,
                }),
            ],
            extract: true, // CSSファイルを別に出力
        }),
        terser(),
        copy({
            targets: [
                {
                    src: 'node_modules/@fortawesome/fontawesome-free/webfonts/*',
                    dest: 'dist/assets'  // `/dist/assets/webfonts` にコピー
                }
            ]
        }),
    ],
    watch: {
        clearScreen: false
    }
}
