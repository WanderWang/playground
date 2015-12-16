var path = require("path");
module.exports = {
	context: __dirname,
	entry: "./app/app.js",
	output: {
		path: path.join(__dirname, "assets"),
		publicPath: "assets/",
		filename: "main.js",
		chunkFilename: "[hash].[id].js"
	},
	module: {
		loaders: [
			{ test: /\.json$/,   loader: "json-loader" },
			{ test: /\.d.ts/,   loader: "raw-loader" },
			{ test: /\.coffee$/, loader: "coffee-loader" },
			{ test: /\.css$/,    loader: "style-loader!css-loader" },
			{ test: /\.less$/,   loader: "style-loader!css-loader!less-loader" },
			{ test: /\.png$/,    loader: "url-loader?prefix=img/&limit=5000&minetype=image/png" },
			{ test: /\.jpg$/,    loader: "url-loader?prefix=img/&limit=5000&minetype=image/jpg" },
			{ test: /\.gif$/,    loader: "url-loader?prefix=img/&limit=5000&minetype=image/gif" },
			{ test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000&minetype=application/font-woff" }
		],
		preLoaders: [
			{
				test: /\.js$/,
				include: pathToRegExp(path.join(__dirname, "app")),
				loader: "jshint-loader"
			}
		]
	},
	provide: {
		"__webpack_require_loader__": path.join(__dirname, "app", "webpackLoaders.js")
	},
	cache: true,
	plugins: [
		]
};
function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
function pathToRegExp(p) { return new RegExp("^" + escapeRegExpString(p)); }