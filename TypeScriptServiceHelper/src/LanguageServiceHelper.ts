import * as fs from "fs";
import * as ts from "typescript";
import * as path from "path";

export function createDefaultLanguageServiceHost(files: FileSystem, options) {

    const servicesHost: ts.LanguageServiceHost = {

        getScriptFileNames: () => files.getAllFileName(),

        getScriptVersion: (fileName) => files.getFileVersion(fileName),

        getScriptSnapshot: (fileName) => {
            var fullpathFilename = path.join(servicesHost.getCurrentDirectory(), fileName);
            if (!fs.existsSync(fullpathFilename)) {
                return undefined;
            }

            return ts.ScriptSnapshot.fromString(fs.readFileSync(fullpathFilename).toString());
        },

        getCurrentDirectory: () => files.getRootDirectory(),

        getCompilationSettings: () => options,

        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    };

    return servicesHost;


}


export function emitFile(services: ts.LanguageService, files: FileSystem, fileName: string) {
    let output = services.getEmitOutput(fileName);
    logErrors(services, fileName);
    if (!output.emitSkipped) {
        console.log(`Emitting ${fileName}`);
    }
    else {
        console.log(`Emitting ${fileName} failed`);
        logErrors(services, fileName);
    }

    output.outputFiles.forEach(o => {
        var fullPath = path.join(files.getRootDirectory(), o.name);
        fs.writeFileSync(fullPath, o.text, "utf8");
        files.writeFile(fileName,o.text);
    });
}

function logErrors(services: ts.LanguageService, fileName: string) {
    let allDiagnostics = services.getCompilerOptionsDiagnostics()
        .concat(services.getSyntacticDiagnostics(fileName))
        .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach(diagnostic => {
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            console.log(`  Error: ${message}`);
        }
    });
}

export interface FileSystem {

    forEach: (callback: (fileName: string) => void) => void;

    getFileVersion: (fileName: string) => string;

    writeFile: (fileName: string , text:string) => void;

    init: (rootDirectory: string) => void;

    getAllFileName: () => Array<string>;

    getRootDirectory: () => string;

}

interface FileMap<T> {

    [index: string]: T;

}


export interface SourceCode {

    version: string;

    text: string;


}


export function createDefaultFileVersionSystem(): FileSystem {


    var files: FileMap<SourceCode> = {};


    var root: string;

    var result: FileSystem = {

        init(rootDirectory: string) {

            const filterTypeScriptFile = (fileName) => {
                var result1 = fileName.length >= 3;
                var result2 = fileName.substr(fileName.length - 3, 3) === ".ts";
                var result3 = fileName.substr(fileName.length - 4, 4) === ".tsx";
                return result1 && (result2 || result3);
            }


            const forEach = (directory, callback) => {

                var currentDirectoryFiles = fs.readdirSync(directory);
                currentDirectoryFiles.forEach(fileName => {
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
            
            const generateSourceCode = (fileName) => {
                var fullpathFileName = path.join(rootDirectory,fileName);
                files[fileName] = { version: "0",text:fs.readFileSync(fullpathFileName,"utf-8") };

            }

            var arr = [];
            forEach(rootDirectory, (fileName) => arr.push(fileName));
            arr = arr.filter(filterTypeScriptFile);

            arr.forEach(generateSourceCode);
            
            root = rootDirectory;


        },

        forEach: (callback) => {
            for (var fileName in files) {
                callback(fileName);
            }
        },

        getFileVersion: (fileName: string) => {
            return files[fileName] && files[fileName].version
        },

        writeFile: (fileName: string,text:string) => {
            console.log(fileName)
            var code:SourceCode = files[fileName];
             var version: number = parseInt(code.version);
            if (code.text != text){
                code.text = text;
                code.version = (version + 1).toString();       
            }
        },

        getAllFileName: () => {

            var result = [];
            for (var fileName in files) {
                result.push(fileName);
            }
            return result;
        }

        ,

        getRootDirectory: () => {
            return root;
        }

    }

    return result;
}
