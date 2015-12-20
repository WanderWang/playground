
var filesystem = exports.data = {
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
				"lib.d.ts":a = require("raw!./lib.txt")
			}	
		}
	},
	"folder": {
		"": true,
		"entry.js": new Buffer("var a = require('./a.ts');\nconsole.log(a)", "utf-8"),
		"a.ts": new Buffer("class A { constructor(){console.log(111)}};export = A", "utf-8"),
		"style.css": new Buffer("body {\n\tbackground: #333;\n\tcolor: #EEE;\n}", "utf-8")
	}
};
// var endLength = a.length;
// var startLength = "module.exports = ".length;
// filesystem.node_modules.typescript.lib["lib.d.ts"] = a.substr(startLength);

var MemoryOutputFilesystem = require("webpack/lib/MemoryOutputFilesystem");
var MemoryInputFilesystem  = require("enhanced-resolve/lib/MemoryInputFilesystem");

var inFs = new MemoryInputFilesystem(filesystem);
var outFs = new MemoryOutputFilesystem(filesystem);

for(var key in outFs)
	if(typeof outFs[key] === "function")
		exports[key] = outFs[key].bind(outFs);
for(var key in inFs)
	if(typeof inFs[key] === "function")
		exports[key] = inFs[key].bind(inFs);