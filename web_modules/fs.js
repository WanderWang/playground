function prepareStaticSource(moduleId) {
  var filename = require.resolve(moduleId);
  var text = fs.readFileSync(filename, 'utf8');
  return {filename: filename, text: text};
}


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
				"lib.d.ts":new Buffer(require("raw!typescript/lib/lib.d.ts"), "utf-8").toString()
			}
			
		}
	},
	"addStyle.js": new Buffer(require("raw!style-loader/addStyle.js"), "utf-8"),
	"folder": {
		"": true,
		"entry.js": new Buffer("require('./a.ts');\n", "utf-8"),
		"a.ts": new Buffer("class A { constructor(){console.log(111)}};export = A", "utf-8"),
		"style.css": new Buffer("body {\n\tbackground: #333;\n\tcolor: #EEE;\n}", "utf-8")
	}
};

// filesystem[]
//   var filename = require.resolve(moduleId);
//   var text = fs.readFileSync(filename, 'utf8');
//   return {filename: filename, text: text};


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