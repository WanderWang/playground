/**
 * @copyright 2015, Andrey Popp <me@andreypopp.com>
 */
'use strict';
var path = require('path');
var service = require("./LanguageService.js");
var fs = require("fs");

function typescriptLoader(text) {

  service.init();
  var filename = this.resourcePath;
  var content = fs.readFileSync(filename.replace(".tsx",".js"),"utf-8");
  return content;
}

module.exports = typescriptLoader;
