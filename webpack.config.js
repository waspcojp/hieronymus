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
		index: './index.js'
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
				test: /\.woff(2)?(\?v=[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&mimetype=application/font-woff"
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
		},
		modules: [
			'node_modules',
			'front/javascripts',
			'libs'
		],
	}
}
