'use strict';

var stringUtils = require('ember-cli/lib/utilities/string.js');
var inflection  = require('inflection');

function sampleValue(type) {
  switch (type) {
  case 'array':
    return '[]';
  case 'boolean':
    return 'false';
  case 'date':
    return 'new Date()';
  case 'number':
    return '42';
  case 'object':
    return '{}';
  case 'string':
    /* falls through */
  default:
    return '\'MyString\'';
  }
}

module.exports.sampleDataFromAttrs = function sampleDataFromAttrs(attrs) {
  var sampleData = [];
  sampleData.push(' id: 1');

  for(var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    sampleData.push(attr.name + ': ' + attr.sampleValue);
  }

  return '{' + sampleData.join(', ') + ' }';
};

module.exports.entityAttrs = function entityAttrs(entityOptions) {
  var attrs = [];

  for(var name in entityOptions) {
    var type = entityOptions[name] || '';
    var dasherizedType = stringUtils.dasherize(type);
    var attrName = stringUtils.camelize(name);
    var label = inflection.humanize(name);
    attrs.push({ name: attrName, label: label, sampleValue: sampleValue(dasherizedType) });
  }

  return attrs;
};

module.exports.buildNaming = function buildNaming(entityName) {
    var humanizedModuleName = inflection.humanize(entityName);
    var dasherizedModuleName = stringUtils.dasherize(entityName);

    return {
      humanizedModuleName: humanizedModuleName,
      humanizedModuleNamePlural: inflection.pluralize(humanizedModuleName),
      classifiedModuleName: stringUtils.classify(entityName),
      dasherizedModuleName: dasherizedModuleName,
      dasherizedModuleNamePlural: inflection.pluralize(dasherizedModuleName),
      camelizedModuleName: stringUtils.camelize(entityName)
    };
};
