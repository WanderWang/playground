var helper = require("typescript-service-helper");
var ts = require("typescript")

var m = {
	
	host:null,
	
	init:function(){
		
		var options = { module: ts.ModuleKind.CommonJS };
		this.files = helper.createDefaultFileVersionSystem();
    	this.files.init("/");
		this.host = helper.createDefaultLanguageServiceHost(this.files,options);
		this.service = ts.createLanguageService(this.host,ts.createDocumentRegistry());
		this.emit();
	},
	
	
	emit:function(){
		  var allFileNames = this.files.getAllFileName();
		  var self = this;
		  allFileNames.forEach( function(fileName){
			  helper.emitFile(self.service,self.files,fileName);
		  })
	}
	
}

module.exports = m;