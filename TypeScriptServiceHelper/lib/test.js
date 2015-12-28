"use strict";
var fs = require("fs");
var ts = require("typescript");
var languageServiceHelper = require("./LanguageServiceHelper");
function watch(options) {
    var files = languageServiceHelper.createDefaultFileVersionSystem();
    files.init(process.cwd());
    var tsconfig = fs.readFileSync("./tsconfig.json", "utf-8");
    var option = ts.parseConfigFileTextToJson("./tsconfig.json", tsconfig).config.compilerOptions;
    console.log(option);
    return;
    var servicesHost = languageServiceHelper.createDefaultLanguageServiceHost(files, options);
    // Create the language service files
    var services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
    var allFileNames = files.getAllFileName();
    // Now let's watch the files
    allFileNames.forEach(function (fileName) {
        // First time around, emit all files
        languageServiceHelper.emitFile(services, files, fileName);
        // Add a watch on the file to handle next change
        fs.watchFile(fileName, { persistent: true, interval: 250 }, function (curr, prev) {
            // Check timestamp
            if (+curr.mtime <= +prev.mtime) {
                return;
            }
            // Update the version to signal a change in the file
            // write the changes to disk
            languageServiceHelper.emitFile(services, files, fileName);
        });
    });
}
watch({ module: 1 /* CommonJS */, jsx: 2 /* React */ });
//var fileSystem = languageServiceHelper.createDefaultFileVersionSystem();
//fileSystem.init(process.cwd());
//console.log (fileSystem.getAllFileName()) 
