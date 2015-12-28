
var filesystem = exports.data = {
	"":true,
	"node_modules": {
		"": true,
		"css-loader": {
			"": true,
			"index.js": "injected"
		},
		"style-loader": {
			"": true,
			"index.js": "injected",
		},
		"web-ts-loader": {
			"": true,
			"index.js": "injected",
			"TypeScriptWebpackHost":"injected "
		},
		"typescript-loader":{
			
			"": true,
			"index.js": "injected",
			"TypeScriptWebpackHost.js":"injected"		
		},
		
		"typescript":{
			"": true,
			"lib":{
				"": true,
				"lib.d.ts":require("raw!./lib.txt")
			}	
		}
	},
	"typings":{
		"": true,
		"react":{
			"": true,
			"react.d.ts":require("raw!./react.txt")
		}
	},
	"folder": {
		"": true,
		"entry.js": new Buffer("//var a = require('./a.tsx');\nconsole.log(a)", "utf-8"),
		"a.tsx": new Buffer("var A = (<div>a</div>);export = A", "utf-8"),
		"style.css": new Buffer("body {\n\tbackground: #333;\n\tcolor: #EEE;\n}", "utf-8")
	}
};
// var endLength = a.length;
// var startLength = "module.exports = ".length;
// filesystem.node_modules.typescript.lib["lib.d.ts"] = a.substr(startLength);

var MemoryOutputFilesystem = require("memory-fs");
var MemoryInputFilesystem  = require("./MemoryInputFilesystem");
var inFs = new MemoryInputFilesystem(filesystem);
var outFs = new MemoryOutputFilesystem(filesystem);

for(var key in outFs)
	if(typeof outFs[key] === "function")
		exports[key] = outFs[key].bind(outFs);
for(var key in inFs)
	if(typeof inFs[key] === "function")
		exports[key] = inFs[key].bind(inFs);