var path                 = require('path');
var fs                   = require('fs-extra');
var RSVP                 = require('rsvp');
var buildNaming          = require('../../lib/utilities/entity').buildNaming;
var addScaffoldRoutes    = require('../../lib/utilities/scaffold-routes-generator').addScaffoldRoutes;
var removeScaffoldRoutes = require('../../lib/utilities/scaffold-routes-generator').removeScaffoldRoutes;
var chalk                = require('chalk');

module.exports = {
  anonymousOptions: [
    'name',
    'attr:type'
  ],
  description: 'Scaffolds an entire resource',
  invoke: function(name, operation, options) {
    var blueprint = this.lookupBlueprint(name);
    return blueprint[operation](options);
  },
  afterInstall: function(options) {
    this._addScaffoldRoutes(options);
    return RSVP.all([
      this.invoke('model', 'install', options),
      this.invoke('adapter', 'install', options),
      this.invoke('template', 'install', options),
      this.invoke('route', 'install', options),
      this.invoke('mixin', 'install', options),
      this.invoke('acceptance-test', 'install', options)
    ]);
  },
  afterUninstall: function(options) {
    this._removeScaffoldRoutes(options);
    return RSVP.all([
      this.invoke('model', 'uninstall', options),
      this.invoke('adapter', 'uninstall', options),
      this.invoke('template', 'uninstall', options),
      this.invoke('route', 'uninstall', options),
      this.invoke('mixin', 'uninstall', options),
      this.invoke('acceptance-test', 'uninstall', options)
    ]);
  },
  _addScaffoldRoutes: function(options) {
    var routerFile = path.join(options.target, 'app', 'router.js');
    if (fs.existsSync(routerFile)) {
      var locals = buildNaming(options.entity.name);
      var status = addScaffoldRoutes(routerFile, locals);
      this._writeRouterStatus(status, 'green');
    }
  },
  _removeScaffoldRoutes: function(options) {
    var routerFile = path.join(options.target, 'app', 'router.js');
    if (fs.existsSync(routerFile)) {
      var locals = buildNaming(options.entity.name);
      var status = removeScaffoldRoutes(routerFile, locals);
      this._writeRouterStatus(status, 'red');
    }
  },
  _writeRouterStatus: function(status, operationColor) {
    var color = status === 'identical' ? 'yellow' : operationColor;
    this._writeStatusToUI(chalk[color], status, 'app/router.js');
  }
}

