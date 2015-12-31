
var webpack = require("webpack");
var fs = require("fs");
var path = require("path");
var async = require("async");
window.fs = fs;
var fsutil = require("./FileUtil");

window.onload = function(){


	var compiler = createCompiler();
	downloadAllFiles();

	function downloadAllFiles() {

		var files = ["main.tsx", "comp/a.tsx"];
		async.eachSeries(files, download, function (err) {
			if (!err) {
				var compilerButton = document.getElementById("compilerButton");
				compilerButton.onclick = compile;
			}
		});
	}

	function download(item , callback) {
		var url = "http://10.0.2.128:10800/wander/react/" + item;	
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function (){
			if (xhr.readyState == 4){		
				fsutil.save("/folder/" + item,xhr.responseText);
				callback();
			}		
		}
		xhr.open("get",url);
		xhr.send();
	}






	function createCompiler() {
		var compiler = webpack({
			inputFileSystem: fs,
			outputFileSystem: fs,
			context: "/folder",
			entry: "./main.tsx",
			module: {
				loaders: [
					{ test: /\.tsx$/, loader: "web-ts-loader" }
				]
			},
			output: {
				path: "/output",
				filename: "bundle.js"
			},
			externals: {
				"react": "React",
				"react-dom": "ReactDOM"
			}
		});
		return compiler;
	}

	function compile() {
		compiler.run(function (err, stats) {
			var statDiv = document.getElementById("stats");
			if (err) {
				statDiv.innerText = err.stack;
			}
			statDiv.innerText = stats.toString();
			updatePreview();
		});
	}

	function updatePreview() {

		var scriptTag = "<script src='http://10.0.2.128:10800/wander/common/react.min.js'></script>";
		scriptTag += "<script src='http://10.0.2.128:10800/wander/common/react-dom.min.js'></script>";
		var bundle = fs.readFileSync("/output/bundle.js").toString();
		var iframe = document.getElementById("iframe");
		iframe.srcdoc = "<html><body>" + scriptTag + "<script>" + bundle + "</script></body></html>";
	}
};
