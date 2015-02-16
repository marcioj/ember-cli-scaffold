var path                 = require('path');
var assign               = require('lodash-node/compat/objects/assign');
var inflection           = require('inflection');
var stringUtils          = require('ember-cli/lib/utilities/string.js');
var sampleDataFromAttrs  = require('../../lib/utilities/entity').sampleDataFromAttrs;
var entityAttrs          = require('../../lib/utilities/entity').entityAttrs;
var buildNaming          = require('../../lib/utilities/entity').buildNaming;
var addScaffoldRoutes    = require('../../lib/utilities/scaffold-routes-generator').addScaffoldRoutes;
var removeScaffoldRoutes = require('../../lib/utilities/scaffold-routes-generator').removeScaffoldRoutes;

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
    var attrs = entityAttrs(options.entity.options);
    var sampleData = sampleDataFromAttrs(attrs);
    var locals = buildNaming(options.entity.name);
    locals.sampleData = sampleData;
    locals.attrs = attrs;
    return locals;
  },
  afterInstall: function(options) {
    var target = options.target;
    var routerFile = path.join(target, 'app', 'router.js');
    addScaffoldRoutes(routerFile, this.locals(options));

    return this.invoke('model');
  },
  afterUninstall: function(options) {
    var target = options.target;
    var routerFile = path.join(target, 'app', 'router.js');
    removeScaffoldRoutes(routerFile, this.locals(options));

    return this.invoke('model');
  },
};

assign(blueprint, require('../../lib/blueprint/ext'))

module.exports = blueprint;
