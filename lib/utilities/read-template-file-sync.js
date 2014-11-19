var fs        = require('fs-extra');
var path      = require('path');
var template  = require('lodash-node/modern/utilities/template');
var addonRoot = path.join(__filename, '..', '..', '..');

function readTemplateFileSync(name, context) {
  var templateContent = fs.readFileSync(path.join(addonRoot, 'templates', name), 'utf8');
  return template(templateContent, context);
}

module.exports = readTemplateFileSync;
