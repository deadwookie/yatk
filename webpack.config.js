// Documentation: https://webpack.js.org/configuration
// Inpsired by https://github.com/rokoroku/react-mobx-typescript-boilerplate/blob/master/webpack.config.js
const path = require('path')
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// variables
const PORT = process.env.PORT || 8080
const IS_PROD = Boolean(~process.argv.indexOf('-p') || process.env.NODE_ENV === 'production')
const SRC_PATH = path.resolve(__dirname, 'src')
const BUILD_PATH = path.resolve(__dirname, 'build')

module.exports = {
	// Because JavaScript can be written for both server and browser, webpack offers multiple deployment targets
	target: 'web',

	// The base directory, an absolute path, for resolving entry points and loaders from configuration
	context: SRC_PATH,

	// The point or points to enter the application. At this point the application starts executing.
	// Simple rule: one entry point per HTML page. SPA: one entry point, MPA: multiple entry points
	entry: {
		// Each key is the name of a chunk, and the value describes the entrypoint for the chunk
		index: IS_PROD ? './index.tsx' : [
			// Activate HMR for React
			'react-hot-loader/patch',
			// Bundle the client for webpack-dev-server
			// And connect to the provided endpoint
			`webpack-dev-server/client?http://localhost:${PORT}`,
			// Bundle the client for hot reloading
			// Only- means to only hot reload for successful updates (and prevents reload on syntax errors)
			'webpack/hot/only-dev-server',
			// Our app main entry
			'./index.tsx'
		],
		vendor: [
			'tslib',
			'react',
			'react-dom',
			// 'react-router',
			// 'mobx',
			// 'mobx-react',
			// 'mobx-react-router',
		],
	},

	// Set of options instructing webpack on how and where it should output
	output: {
		path: BUILD_PATH,
		// This option determines the name of each output bundle.
		// Use entry name substitution to give each bundle a unique name
		filename: `js/[name].${IS_PROD ? '[chunkhash:6].js' : 'js?[hash:6]'}`,
		// Tell webpack to include comments in bundles with information about the contained modules
		pathinfo: !IS_PROD,
	},

	// Source mapping to enhance the debugging process. These values can affect build and rebuild speed dramatically.
	// "eval" (generated code): Each module is executed with eval() and //@ sourceURL
	// "cheap-module-eval-source-map" (original source - lines only): each module is executed with eval() and a SourceMap is added as a DataUrl
	// "source-map" (original source): A full SourceMap is emitted as a separate file
	devtool: IS_PROD ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
	// devtool: 'inline-source-map',

	// These options change how modules are resolved
	resolve: {
		// Automatically resolve certain extensions (overrides the default array)
		extensions: ['.ts', '.tsx', '.js'],
		// Create aliases to import or require certain modules more easily
		alias: {
			'components': path.resolve(SRC_PATH, 'components'),
		},
		// Determine which fields in it's `package.json` are checked.
		// Fix webpack's default behavior to not load packages with jsnext:main module
		// (jsnext:main directs not usually distributable es6 format, but es6 sources)
		mainFields: ['module', 'browser', 'main'],
	},

	// These options determine how the different types of modules within a project will be treated
	module: {
		// An array of Rules which are matched to requests when modules are created.
		// These rules can modify how the module is created.
		// They can apply loaders to the module, or modify the parser
		rules: [
			{
				// All files with a `.ts` or `.tsx` extension will be handled by `awesome-typescript-loader`.
				test: /\.tsx?$/,
				use: IS_PROD ? 'awesome-typescript-loader' : [
					'react-hot-loader/webpack',
					'awesome-typescript-loader',
				],
			},
			{
				// All output `.js` files will have any sourcemaps re-processed by `source-map-loader`.
				test: /\.js$/,
				// Specifies the category of the loader. Possible values: "pre" | "post".
				// All loaders are sorted in the order post, inline, normal, pre and used in this order
				enforce: 'pre',
				use: 'source-map-loader',
			},
			{
				// Process all `.css` to be extracted into a single file (per entry)
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					// Would be used when the CSS is not extracted (i.e. in an additional chunk when `allChunks: false`)
					fallback: 'style-loader',
					// Loader(s) that should be used for converting the resource to a CSS exporting module (required)
					use: [
						{
							// The css-loader interprets `@import` and `url()` like requires
							loader: 'css-loader',
							options: {
								// This enables local scoped CSS by default → https://github.com/css-modules/css-modules
								modules: true,
								// To include Sourcemaps (the extract-text-webpack-plugin can handle them).
								sourceMap: !IS_PROD,
								// That many loaders after the css-loader are used to import resources.
								// More info: https://github.com/webpack-contrib/css-loader/issues/228
								// (Mostly this is need to make postcss-loader work when css-loader has `modules: true`)
								importLoaders: 1,
								// The loader replaces local selectors with unique identifiers.
								// The choosen unique identifiers are exported by the module
								localIdentName: IS_PROD ? '[hash:base64]' : '[path]-[local]-[hash:base64:3]'
							}
						},
						// {
						// 	// PostCSS is a tool for transforming styles with JS plugins.
						// 	// These plugins can lint your CSS, support variables and mixins,
						// 	// transpile future CSS syntax, inline images, and more
						// 	loader: 'postcss-loader',
						// 	options: {
						// 		// Currently, more than 200 plugins → http://postcss.parts
						// 		plugins: () => [
						// 			require('postcss-reporter')(),
						// 			require('postcss-browser-reporter')({ disabled: IS_PROD }),
						// 		],
						// 	},
						// },
					],
				}),
			},
			{
				// Typical static files
				test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							// If the file is greater than the limit (in bytes) the `file-loader` is used
							limit: 4096,
							// Configure a custom filename template for your file.
							// (To retain the full directory structure, you might use "[path][name].[ext]")
							name: IS_PROD ? '[hash].[ext]' : '[name].[hash:6].[ext]',
							// You can specify custom output and public paths by using
							// the `outputPath`, `publicPath` and `useRelativePath`
							outputPath: 'resources/',
							publicPath: '../',
							// useRelativePath: true,
						},
					},
				],
			},
			// { test: /\.html$/, use: 'html-loader' },
		],
	},

	// Option is used to customize the webpack build process in a variety of ways.
	// For example, when multiple bundles share some of the same dependencies,
	// the `CommonsChunkPlugin` could be useful to extract those dependencies into a shared bundle to avoid duplication
	plugins: [
		// Enable HMR globally
		!IS_PROD && new webpack.HotModuleReplacementPlugin(),

		// Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
		// inside your code for any environment checks; UglifyJS will automatically
		// drop any unreachable code.
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
		}),
		// Prints more readable module names in the browser console on HMR updates
		new webpack.NamedModulesPlugin(),

		// If you want to use new "paths" and "baseUrl" feature of TS 2.0 please include `TsConfigPathsPlugin`
		new TsConfigPathsPlugin(),
		// `CheckerPlugin` is optional. Use it if you want async error reporting.
		// We need this plugin to detect a `--watch` mode
		!IS_PROD && new CheckerPlugin(),

		// An opt-in feature that creates a separate file (known as a chunk),
		// consisting of common modules shared between multiple entry points
		new webpack.optimize.CommonsChunkPlugin({
			// The name & resulting file of the commons chunk
			name: 'vendor',
			filename: `js/vendor.${IS_PROD ? '[chunkhash:6].js' : 'js?[hash:6]'}`,
			// The minimum number of chunks which need to contain a module before it's moved into the commons chunk
			// In such case we ensure that no other module goes into the vendor chunk (except explicit list in `entry.vendor`)
			minChunks: Infinity,
			// Other way is to gather implicit vendor libs from node_modules by providing a callback func
			// minChunks: (module) => module.context && module.context.indexOf("node_modules") !== -1,
		}),
		// new webpack.optimize.AggressiveMergingPlugin(),
		IS_PROD && new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			beautify: false,
			comments: false,
			compress: {
				warnings: false,
				drop_console: true,
				screw_ie8: true
			},
			mangle: {
				except: [
					'$', 'webpackJsonp'
				],
				screw_ie8: true,
				keep_fnames: true
			},
			output: {
				comments: false,
				screw_ie8: true
			}
		}),,

		// It moves all the `require("style.css")`s in entry chunks into a separate single CSS file
		new ExtractTextPlugin({
			filename: `css/[name].${IS_PROD ? '[contenthash:6].css' : 'css?[contenthash:6]'}`,
			// When it's disabled, then styles will be inlined in js files
			// Unfortunately `ExtractTextPlugin` doesn't work with HMR
			// (https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/30)
			disable: !IS_PROD,
			// Extract from all additional chunks too (by default it extracts only from the initial chunk(s))
			allChunks: true,
			// Disables order check (useful for CSS Modules!), false by default
			ignoreOrder: true,
		}),

		// It simplifies creation of HTML files to serve your webpack bundles.
		// This is especially useful when  bundles include a hash in the filename which changes every compilation
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
		}),
	].filter(k => !!k),

	// webpack-dev-server provides an easy to use development server with fast live reloading.
	devServer: {
		port: PORT,
		// Enable webpack's Hot Module Replacement feature
		hot: !IS_PROD,
		// Tell the server where to serve content from. This is only necessary if you want to serve static files.
		contentBase: false,
		// Enable gzip compression for everything served
		compress: true,
		// When using the HTML5 History API
		historyApiFallback: true,
		// All the stats options here: https://webpack.js.org/configuration/stats/
		stats: 'minimal',
		// stats: {
		// 	// Color is life
		// 	colors: true,
		// 	// This reduces the amount of stuff in terminal
		// 	chunks: false,
		// 	// 'errors-only': true
		// }
	},
}
