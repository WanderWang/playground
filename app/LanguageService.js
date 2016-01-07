var helper = require("typescript-service-helper");
var ts = require("typescript")

var m = {

    host: null,

    init: function () {


        var options = { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React };
        this.files = helper.createDefaultFileVersionSystem();
        this.files.init("/");
        this.host = helper.createDefaultLanguageServiceHost(this.files, options);
        this.service = ts.createLanguageService(this.host, ts.createDocumentRegistry());

        this.emit();


        var entries = performance.getEntriesByType("mark");
        console.log(entries)
    },


    emit: function () {
        var allFileNames = this.files.getAllFileName();
        var self = this;
        allFileNames.forEach(function (fileName) {
            if (fileName.indexOf(".d.ts") == -1 ){
                 helper.emitFile(self.service, self.files, fileName);
            }
        })
    }

}

module.exports = m;