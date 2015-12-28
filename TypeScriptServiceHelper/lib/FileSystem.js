var fs = require("fs");
function createDefaultFileVersionSystem() {
    var files = {};
    var root;
    var result = {
        init: function (rootDirectory) {
            var filterTypeScriptFile = function (fileName) { return fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts"; };
            var currentDirectoryFiles = fs.readdirSync(rootDirectory).filter(filterTypeScriptFile);
            currentDirectoryFiles.forEach(function (fileName) {
                files[fileName] = { version: "0" };
            });
            root = rootDirectory;
        },
        forEach: function (callback) {
            for (var fileName in files) {
                callback(fileName);
            }
        },
        getFileVersion: function (fileName) {
            console.log(files[fileName] && files[fileName].version, fileName);
            return files[fileName] && files[fileName].version;
        },
        updateFileVersion: function (fileName) {
            console.log(fileName);
            var version = parseInt(files[fileName].version);
            files[fileName].version = (version + 1).toString();
        },
        getAllFileName: function () {
            var result = [];
            for (var fileName in files) {
                result.push(fileName);
            }
            return result;
        },
        getRootDirectory: function () {
            return root;
        }
    };
    return result;
}
exports.createDefaultFileVersionSystem = createDefaultFileVersionSystem;
