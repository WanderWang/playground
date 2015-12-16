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
		}
	},
	"addStyle.js": new Buffer(require("raw!style-loader/addStyle.js"), "utf-8"),
	"folder": {
		"": true,
		"entry.js": new Buffer("require('./style.css');\n", "utf-8"),
		"template.ts": new Buffer("class A (\n)", "utf-8"),
		"style.css": new Buffer("body {\n\tbackground: #333;\n\tcolor: #EEE;\n}", "utf-8")
	}
};


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