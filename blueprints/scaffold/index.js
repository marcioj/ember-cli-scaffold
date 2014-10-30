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

module.exports = {
  anonymousOptions: [
    'name',
    'attr:type'
  ],
  description: '',
  fileMapTokens: function(options) {
    return {
      __name__: function(options) {
        // TODO pluralize properly
        return options.dasherizedModuleName + 's';
      }
    }
  },
  locals: function(options) {
    var name = options.entity.name;
    var entityOptions = options.entity.options;
    var classifiedModuleName = stringUtils.classify(name);
    var dasherizedModuleName = stringUtils.dasherize(name);
    var dasherizedModuleNamePlural = inflection.pluralize(dasherizedModuleName);
    var camelizedModuleName = stringUtils.camelize(name);
    var attrs = [];

    for(var name in entityOptions) {
      var attrName = stringUtils.camelize(name);
      var label = humanize(name);
      attrs.push({ name: attrName, label: label });
    }

    return {
      attrs: attrs,
      classifiedModuleName: classifiedModuleName,
      dasherizedModuleName: dasherizedModuleName,
      dasherizedModuleNamePlural: dasherizedModuleNamePlural,
      camelizedModuleName: camelizedModuleName
    }
  },
  afterInstall: function(options) {
    // TODO normalize the name
    var resourceName = options.entity.name;
    var singularResourceName = resourceName;
    var pluralResourceName = resourceName + 's';
    var target = options.target;
    var routerFile = path.join(target, 'app', 'router.js');
    var resourceRouterContent = renderTemplate('resource-router', { resource: { plural: pluralResourceName, singular: singularResourceName } })
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
    // TODO normalize the name
    var resourceName = options.entity.name;
    var singularResourceName = resourceName;
    var pluralResourceName = resourceName + 's';
    var target = options.target;
    var routerFile = path.join(target, 'app', 'router.js');
    var resourceRouterContent = renderTemplate('resource-router', { resource: { plural: pluralResourceName, singular: singularResourceName } })
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
