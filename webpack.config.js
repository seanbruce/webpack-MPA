const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const inDevMode = process.env.NODE_ENV === 'development';

module.exports = {
	mode: 'production',
	devServer: {
		contentBase: './dist'
	},
	devtool: 'source-map',
	entry: {
		pageOne: './src/index/index.js',
		contact: './src/contact/contact.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					// {
					// 	loader: MiniCssExtractPlugin.loader
					// },
					inDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: { sourceMap: true }
					}
				]
			},
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		]
	},
	plugins: [
		new CleanWebpackPlugin('./dist', {
			verbose: true,
			beforeEmit: true
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index/index.html',
			inject: true,
			chunks: ['pageOne']
		}),
		new HtmlWebpackPlugin({
			filename: 'contact.html',
			template: 'src/contact/contact.html',
			inject: true,
			chunks: ['contact']
		})
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	}
};
