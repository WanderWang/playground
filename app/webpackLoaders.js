module.exports = function (filename) {
	
	if (filename.indexOf("web-ts-loader") >= 0){
		var result = require("./web-ts-loader");
		result.query = "?jsx=react";
		return result;
	}
	switch (filename) {
		case "/node_modules/css-loader/index.js":
			return require("css-loader");
		case "/node_modules/style-loader/index.js":
			return require("style-loader");
	}
};