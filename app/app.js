var $ = require("jquery");
require("mybootstrap");
var webpack = require("webpack");
var fs = require("fs");
var path = require("path");
window.fs = fs;

$(function () {

	$(".compile").click(compile);
	var compiler = createCompiler();
	compile();

	
	function createCompiler() {
		var compiler = webpack({
			inputFileSystem: fs,
			outputFileSystem: fs,
			context: "/folder",
			entry: "./entry.js",
			module: {
				loaders: [
					{ test: /\.css$/, loader: "style-loader!css-loader" },
					{ test: /\.ts/, loader: "web-ts-loader?jsx=react" },
					{ test: /\.tsx/, loader: "web-ts-loader?jsx=react" }
				]
			},
			output: {
				path: "/output",
				filename: "bundle.js"
			}
		});
		return compiler;
	}

	function compile() {
		compiler.run(function (err, stats) {
			if (err) return $(".stats").text(err.stack);
			$(".stats").text(stats.toString());
			updatePreview();
		});
	}

	function updatePreview() {
		var bundle = fs.readFileSync("/output/bundle.js").toString()
		$("iframe")[0].srcdoc = "<html><body><script>" + bundle + "</script></body></html>";
	}
});
