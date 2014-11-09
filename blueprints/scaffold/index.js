var path        = require('path');
var fs          = require('fs-extra');
var template    = require('lodash-node/modern/utilities/template');
var addonRoot   = path.join(__filename, '..', '..', '..');
var Blueprint   = require('ember-cli/lib/models/blueprint');
var inflection  = require('inflection');
var stringUtils = require('ember-cli/lib/utilities/string.js');

function humanize(word) {
  return stringUtils.capitalize(word.toLowerCase().replace(/_/g, ' '));
}

function renderTemplate(name, context) {
  var templateContent = fs.readFileSync(path.join(addonRoot, 'templates', name), 'utf8');
  return template(templateContent, context);
}

function insertInto(file, match, newContent) {
  fs.ensureFileSync(file);
  var fileContent = fs.readFileSync(file, 'utf8');
  if (fileContent.indexOf(newContent) !== -1) {
    return;
  }
  var index = fileContent.indexOf(match);
  if (index !== -1) {
    index = index + match.length;
    fileContent =  fileContent.substring(0, index) + newContent + fileContent.substring(index, fileContent.length);
    fs.writeFileSync(file, fileContent); }
}

function removeFromFile(file, match) {
  fs.ensureFileSync(file);
  var fileContent = fs.readFileSync(file, 'utf8');
  var index = fileContent.indexOf(match);
  if (index >= 0) {
    fileContent = fileContent.substring(0, index) + fileContent.substring(index + match.length, fileContent.length);
    fs.writeFileSync(file, fileContent);
  }
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

module.exports = {
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
    var humanizedModuleName = humanize(name);
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
      var label = humanize(name);
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
    insertInto(routerFile, 'Router.map(function() {\n', resourceRouterContent);

    var blueprint = Blueprint.lookup('model', {
      ui: this.ui,
      analyctics: this.analyctics,
      project: this.project,
      ignoreMissing: true
    });

    return blueprint.install(options);
  },
  afterUninstall: function(options) {
    var target = options.target;
    var routerFile = path.join(target, 'app', 'router.js');
    var resourceRouterContent = renderTemplate('resource-router', this.locals(options));
    removeFromFile(routerFile, resourceRouterContent);

    var blueprint = Blueprint.lookup('model', {
      ui: this.ui,
      analyctics: this.analyctics,
      project: this.project,
      ignoreMissing: true
    });

    return blueprint.uninstall(options);
  },
};
