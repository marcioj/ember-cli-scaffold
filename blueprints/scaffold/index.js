var path                 = require('path');
var inflection           = require('inflection');
var sampleDataFromAttrs  = require('../../lib/utilities/entity').sampleDataFromAttrs;
var entityAttrs          = require('../../lib/utilities/entity').entityAttrs;
var buildNaming          = require('../../lib/utilities/entity').buildNaming;
var addScaffoldRoutes    = require('../../lib/utilities/scaffold-routes-generator').addScaffoldRoutes;
var removeScaffoldRoutes = require('../../lib/utilities/scaffold-routes-generator').removeScaffoldRoutes;
var Blueprint            = require('../../lib/blueprint/ext');
var chalk                = require('chalk');

module.exports = Blueprint.extend({
  anonymousOptions: [
    'name',
    'attr:type'
  ],
  description: '',
  fileMapTokens: function(options) {
    return {
      __name_singular__: function(options) {
        return options.locals.dasherizedModuleName
      },
      __name__: function(options) {
        return options.locals.dasherizedModuleNamePlural
      }
    }
  },
  locals: function(options) {
    var attrs = entityAttrs(options.entity.options);
    var sampleData = sampleDataFromAttrs(attrs);
    var locals = buildNaming(options.entity.name);
    locals.sampleData = sampleData;
    locals.attrs = attrs;
    return locals;
  },
  afterInstall: function(options) {
    this._addScaffoldRoutes(options);
    return this.invoke('model');
  },
  afterUninstall: function(options) {
    this._removeScaffoldRoutes(options);
    return this.invoke('model');
  },
  _addScaffoldRoutes: function(options) {
    var routerFile = path.join(options.target, 'app', 'router.js');
    this._writeStatusToUI(chalk.green, 'change', 'app/router.js');
    if(!options.dryRun) {
      addScaffoldRoutes(routerFile, this.locals(options));
    }
  },
  _removeScaffoldRoutes: function(options) {
    var routerFile = path.join(options.target, 'app', 'router.js');
    this._writeStatusToUI(chalk.red, 'change', 'app/router.js');
    if(!options.dryRun) {
      removeScaffoldRoutes(routerFile, this.locals(options));
    }
  }
});

