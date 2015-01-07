var fs                   = require('fs-extra');
var EmberRouterGenerator = require('ember-router-generator');

function addScaffoldRoutes(routerFile, options) {
  if (!fs.existsSync(routerFile)) {
    return;
  }
  var fileContent = fs.readFileSync(routerFile, 'utf8');
  var routes = new EmberRouterGenerator(fileContent);
  var newFileContent = routes
    .add(options.dasherizedModuleNamePlural, { type: 'resource' })
    .add(options.dasherizedModuleNamePlural + '/new')
    .add(options.dasherizedModuleNamePlural + '/edit', { path: ':' + options.dasherizedModuleName + '_id/edit' })
    .add(options.dasherizedModuleNamePlural + '/show', { path: ':' + options.dasherizedModuleName + '_id' })
    .code();
  fs.writeFileSync(routerFile, newFileContent);
}

module.exports.addScaffoldRoutes = addScaffoldRoutes;

function removeScaffoldRoutes(routerFile, options) {
  if (!fs.existsSync(routerFile)) {
    return;
  }
  var fileContent = fs.readFileSync(routerFile, 'utf8');
  var routes = new EmberRouterGenerator(fileContent);
  var newFileContent = routes
    .remove(options.dasherizedModuleNamePlural, { type: 'resource' })
    .code();
  fs.writeFileSync(routerFile, newFileContent);
}

module.exports.removeScaffoldRoutes = removeScaffoldRoutes;
