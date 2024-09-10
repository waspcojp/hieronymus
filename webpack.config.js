const path = require('path')
const webpack = require('webpack')

const MODE = "development";
//const MODE = "production";

const prod = MODE === 'production';

module.exports = {
	mode: MODE,
	context: path.resolve(__dirname, 'front/javascripts'),
    entry: {
		home: './home.js',
		common: './common.js',
		journal: './journal.js',
		ledger: './ledger.js',
		accounts: './accounts.js',
		trial_balance: './trial-balance.js',
		customer: './customer.js',
		voucher: './voucher.js',
		'bank-ledger': './bank-ledger.js',
		index: './index.js',
		changes: './changes.js',
    	setup: './setup.js'
	},
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: '[name].js'
    },
    devtool: false,
	watchOptions: {
		ignored: [ 'node_modules', 'public', 'views', 'tests', 'temp', 'models', 'migrations', 'dist', 'config', 'routes' ]
	},
	module: {
        rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: !prod
						},
						emitCss: prod,
						hotReload: !prod
					}
				}
			},
			{
				test: /\.css/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.(scss)$/,
				use: [{
					// Adds CSS to the DOM by injecting a `<style>` tag
					loader: 'style-loader'
				  },
				  {
					// Interprets `@import` and `url()` like `import/require()` and will resolve them
					loader: 'css-loader'
				  },
				  {
					// Loads a SASS/SCSS file and compiles it to CSS
					loader: 'sass-loader',
					options: {
						  sassOptions: {
							includePaths: ['node_modules']
						  }
					   }
				}
				]
			  },
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i, 
				type: 'asset/resource', 
				generator: {
					filename: 'fonts/[name][ext][query]'
				}
			},
            {
				test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                  {loader: 'file-loader'},
                  {
                    loader: 'svgo-loader',
                    /*options: {
                      plugins: [
                        {removeXMLNS: true},
                        {removeOffCanvasPaths: true},
                        {removeDimensions: true},
                        {reusePaths: true}
                      ]
                    }*/
                  }
				]
			},
			{
                test: /\.(ttf|eot|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'file-loader',
                }]
            }
		]
    },
	resolve: {
		alias: {
			path: "path-browserify",
			'chart.js$': path.resolve(__dirname, 'node_modules/chart.js/dist/Chart.js')
		},
		modules: [
			'node_modules',
			'front/javascripts',
			'libs'
		],
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
		conditionNames: ['svelte', 'browser']
	}
}
