import { defineConfig } from 'vite';
import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import postcssUrl from 'postcss-url';

const realPath = (name) => {
  return  path.resolve(__dirname, path.resolve('front/javascripts', name));
}

export default defineConfig({
  root: path.resolve(__dirname, 'front/javascripts'),
  base: '/dist/',
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    cssUrl: 'relative',
    rollupOptions: {
      input: {
        home: realPath('home.js'),
        common: realPath('common.js'),
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
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        //assetFileNames: '[name].[ext]'
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return '[name].[ext]';  // CSSファイルを/dist/直下に配置
          }
          return 'assets/[name].[ext]';  // 他のファイルは/assets/に配置
        }
      },
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: process.env.NODE_ENV !== 'production'
      }
    })
  ],
  resolve: {
    alias: {
      'path': 'path-browserify'
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    dedupe: ['svelte'],
  },
  css: {
    postcss: {
      plugins: [
      ],
    },
  },
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/public/**',
        '**/views/**',
        '**/tests/**',
        '**/temp/**',
        '**/models/**',
        '**/migrations/**',
        '**/dist/**',
        '**/config/**',
        '**/routes/**'
      ]
    }
  }
});