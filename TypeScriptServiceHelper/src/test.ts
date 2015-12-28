import * as fs from "fs";
import * as ts from "typescript";
import * as languageServiceHelper from "./LanguageServiceHelper";

function watch(options: ts.CompilerOptions) {

    var files: languageServiceHelper.FileSystem = languageServiceHelper.createDefaultFileVersionSystem();
    files.init(process.cwd());
    const servicesHost: ts.LanguageServiceHost = languageServiceHelper.createDefaultLanguageServiceHost(files,options);

    // Create the language service files
    const services = ts.createLanguageService(servicesHost,ts.createDocumentRegistry());

    var allFileNames = files.getAllFileName();
        
    // Now let's watch the files
    allFileNames.forEach(fileName => {
        // First time around, emit all files
        languageServiceHelper.emitFile(services,files,fileName);

        // Add a watch on the file to handle next change
        fs.watchFile(fileName,
            { persistent: true,interval: 250 },
            (curr,prev) => {
                // Check timestamp
                if(+curr.mtime <= +prev.mtime) {
                    return;
                }

                // Update the version to signal a change in the file
               

                // write the changes to disk
                
                languageServiceHelper.emitFile(services,files,fileName);
            });
    });
}



watch({ module: ts.ModuleKind.CommonJS,jsx: ts.JsxEmit.React });

//var fileSystem = languageServiceHelper.createDefaultFileVersionSystem();
//fileSystem.init(process.cwd());
//console.log (fileSystem.getAllFileName())