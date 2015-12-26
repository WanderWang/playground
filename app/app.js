var $ = require("jquery");
require("mybootstrap");
var webpack = require("webpack");
var fs = require("fs");
var path = require("path");
var async = require("async");
window.fs = fs;

$(function () {


	
	var compiler = createCompiler();

	function download() {

		var files = ["test.js","a.tsx"];
		async.eachSeries(files, function (item, callback) {

			var url = "http://10.0.2.128:10800/wander/react/" + item;
			var setting = {
				"url": url,
				"dataType": 'text',
				"success": function (data) {
					console.log ("save:",item,data)
					fs.writeFileSync("/folder/" + item, data);
					callback();
				}
			};
			$.ajax(setting);


		}, function (err) {
			if (!err){
				$(".compile").click(compile);
			}
		});
	}
	download();

	return;








	function createCompiler() {
		var compiler = webpack({
			inputFileSystem: fs,
			outputFileSystem: fs,
			context: "/folder",
			entry: "./test.js",
			module: {
				loaders: [
					{ test: /\.css$/, loader: "style-loader!css-loader" },
					{ test: /\.tsx$/, loader: "web-ts-loader" }
				]
			},
			output: {
				path: "/output",
				filename: "bundle.js"
			},
			externals: {
				// require("jquery") is external and available
				//  on the global var jQuery
				"react": "React"
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

		var scriptTag = "<script src='http://10.0.2.128:10800/wander/react/react.js'></script>";
		var bundle = fs.readFileSync("/output/bundle.js").toString()
		$("iframe")[0].srcdoc = "<html><body>" + scriptTag + "<script>" + bundle + "</script></body></html>";
	}
});
