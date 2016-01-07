"use strict";
var fs = require("fs");
var ts = require("typescript");
var path = require("path");
function createDefaultLanguageServiceHost(files, options) {
    var servicesHost = {
        getScriptFileNames: function () { return files.getAllFileName(); },
        getScriptVersion: function (fileName) { return files.getFileVersion(fileName); },
        getScriptSnapshot: function (fileName) {
            var fullpathFilename = path.join(servicesHost.getCurrentDirectory(), fileName);
            if (!fs.existsSync(fullpathFilename)) {
                return undefined;
            }
            return ts.ScriptSnapshot.fromString(fs.readFileSync(fullpathFilename).toString());
        },
        getCurrentDirectory: function () { return files.getRootDirectory(); },
        getCompilationSettings: function () { return options; },
        getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
    };
    return servicesHost;
}
exports.createDefaultLanguageServiceHost = createDefaultLanguageServiceHost;
function emitFile(services, files, fileName) {
    var output = services.getEmitOutput(fileName);
    logErrors(services, fileName);
    if (!output.emitSkipped) {
        console.log("Emitting " + fileName);
    }
    else {
        console.log("Emitting " + fileName + " failed");
        logErrors(services, fileName);
    }
    output.outputFiles.forEach(function (o) {
        var fullPath = path.join(files.getRootDirectory(), o.name);
        fs.writeFileSync(fullPath, o.text, "utf8");
        files.updateFileVersion(fileName);
    });
}
exports.emitFile = emitFile;
function logErrors(services, fileName) {
    var allDiagnostics = services.getCompilerOptionsDiagnostics()
        .concat(services.getSyntacticDiagnostics(fileName))
        .concat(services.getSemanticDiagnostics(fileName));
    allDiagnostics.forEach(function (diagnostic) {
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            console.log("  Error " + diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        }
        else {
            console.log("  Error: " + message);
        }
    });
}
function createDefaultFileVersionSystem() {
    var files = {};
    var root;
    var result = {
        init: function (rootDirectory) {
            var filterTypeScriptFile = function (fileName) {
                var result1 = fileName.length >= 3;
                var result2 = fileName.substr(fileName.length - 3, 3) === ".ts";
                var result3 = fileName.substr(fileName.length - 4, 4) === ".tsx";
                return result1 && (result2 || result3);
            };
            var forEach = function (directory, callback) {
                var currentDirectoryFiles = fs.readdirSync(directory);
                currentDirectoryFiles.forEach(function (fileName) {
                    var fullpathFileName = path.join(directory, fileName);
                    var stat = fs.statSync(fullpathFileName);
                    if (stat.isDirectory()) {
                        forEach(fullpathFileName, callback);
                    }
                    else if (stat.isFile()) {
                        var relativeFileName = path.relative(process.cwd(), fullpathFileName);
                        callback(relativeFileName);
                    }
                });
            };
            var arr = [];
            forEach(rootDirectory, function (fileName) { return arr.push(fileName); });
            arr = arr.filter(filterTypeScriptFile);
            arr.forEach(function (fileName) { return files[fileName] = { version: "0" }; });
            root = rootDirectory;
        },
        forEach: function (callback) {
            for (var fileName in files) {
                callback(fileName);
            }
        },
        getFileVersion: function (fileName) {
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
