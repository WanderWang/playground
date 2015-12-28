module.exports = function (filename) {
	if (filename.indexOf("web-ts-loader") >= 0){
		var result = require("./web-ts-loader");
		return result;
	}
};