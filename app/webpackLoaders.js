module.exports = function(filename) {
	switch(filename) {
	case "/node_modules/css-loader/index.js":
		return require("css-loader");
	case "/node_modules/style-loader/index.js":
		return require("style-loader");
	}
};