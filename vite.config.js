import { defineConfig } from 'vite';
import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const realPath = (name) => {
  return  path.resolve(__dirname, path.resolve('front/javascripts', name));
}

export default defineConfig({
  cacheDir: 'node_modules/.vite-cache',
  root: path.resolve(__dirname, 'front/javascripts'),
  base: '/dist/',
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    cssUrl: 'relative',
    rollupOptions: {
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
        setup: realPath('setup.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return '[name].[ext]';  // CSSファイルを/dist/直下に配置
          }
          return 'assets/[name].[ext]';  // 他のファイルは/assets/に配置
        }
      },
    },
  },
  esbuild: {
    minify: true
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