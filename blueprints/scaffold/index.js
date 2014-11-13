var path        = require('path');
var fs          = require('fs-extra');
var template    = require('lodash-node/modern/utilities/template');
var assign    = require('lodash-node/compat/objects/assign');
var addonRoot   = path.join(__filename, '..', '..', '..');
var inflection  = require('inflection');
var stringUtils = require('ember-cli/lib/utilities/string.js');

function renderTemplate(name, context) {
  var templateContent = fs.readFileSync(path.join(addonRoot, 'templates', name), 'utf8');
  return template(templateContent, context);
}

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
  default:
    return "'MyString'";
  }
}

var blueprint = {
  anonymousOptions: [
    'name',
    'attr:type'
  ],
  description: '',
  fileMapTokens: function(options) {
    return {
      __name__: function(options) {
        // TODO use locals instead
        return inflection.pluralize(options.dasherizedModuleName);
      }
    }
  },
  locals: function(options) {
    var name = options.entity.name;
    var entityOptions = options.entity.options;
    var humanizedModuleName = inflection.humanize(name);
    var humanizedModuleNamePlural = inflection.pluralize(humanizedModuleName);
    var classifiedModuleName = stringUtils.classify(name);
    var dasherizedModuleName = stringUtils.dasherize(name);
    var dasherizedModuleNamePlural = inflection.pluralize(dasherizedModuleName);
    var camelizedModuleName = stringUtils.camelize(name);
    var attrs = [];
    var sampleData = [];

    sampleData.push(' id: 1');

    for(var name in entityOptions) {
      var type = entityOptions[name] || '';
      var dasherizedType = stringUtils.dasherize(type);
      var attrName = stringUtils.camelize(name);
      var label = inflection.humanize(name);
      attrs.push({ name: attrName, label: label, sampleValue: sampleValue(dasherizedType) });
      sampleData.push(attrName + ': ' + sampleValue(dasherizedType));
    }
    sampleData = '{' + sampleData.join(', ') + ' }';

    return {
      sampleData: sampleData,
      attrs: attrs,
      humanizedModuleName: humanizedModuleName,
      humanizedModuleNamePlural: humanizedModuleNamePlural,
      classifiedModuleName: classifiedModuleName,
      dasherizedModuleName: dasherizedModuleName,
      dasherizedModuleNamePlural: dasherizedModuleNamePlural,
      camelizedModuleName: camelizedModuleName
    }
  },
  afterInstall: function(options) {
    var target = options.target;
    var routerFile = path.join(target, 'app', 'router.js');
    var resourceRouterContent = renderTemplate('resource-router', this.locals(options));
    this.insertInto(routerFile, 'Router.map(function() {\n', resourceRouterContent);

    return this.invoke('model');
  },
  afterUninstall: function(options) {
    var target = options.target;
    var routerFile = path.join(target, 'app', 'router.js');
    var resourceRouterContent = renderTemplate('resource-router', this.locals(options));
    this.removeFromFile(routerFile, resourceRouterContent);

    return this.invoke('model');
  },
};

assign(blueprint, require('../../lib/blueprint/ext'))

module.exports = blueprint;
