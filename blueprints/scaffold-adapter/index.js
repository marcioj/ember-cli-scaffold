/*jshint node:true*/

var stringUtil  = require('../../lib/utilities/string');
var SilentError = require('../../lib/errors/silent');
var inflection  = require('inflection');
var path = require('path');

module.exports = {
  description: 'Generates an ember-data adapter.',

  availableOptions: [
    { name: 'base-class', type: String }
  ],

  fileMapTokens: function(options) {
    return {
      __name__: function(options) {
        if (options.pod && options.hasPathToken) {
          return 'adapter';
        }
        return options.dasherizedModuleName;
      },
      __path__: function(options) {
        var blueprintName = 'adapter';

        if(blueprintName.match(/-test/)) {
          blueprintName = blueprintName.slice(0, blueprintName.indexOf('-test'));
        }
        if (options.pod && options.hasPathToken) {
          return path.join(options.podPath, options.dasherizedModuleName);
        }
        return inflection.pluralize(blueprintName);
      }
    }
  },

  locals: function(options) {
    return this.lookupBlueprint('adapter').locals(options);
    var adapterName     = options.entity.name;
    var baseClass       = 'DS.RESTAdapter';
    var importStatement = 'import DS from \'ember-data\';';

    if (!options.baseClass && adapterName !== 'application') {
      options.baseClass = 'application';
    }

    if (options.baseClass === adapterName) {
      throw new SilentError('Adapters cannot extend from themself. To resolve this, remove the `--base-class` option or change to a different base-class.');
    }

    if (options.baseClass) {
      baseClass = stringUtil.classify(options.baseClass.replace('\/', '-'));
      baseClass = baseClass + 'Adapter';

      importStatement = 'import ' + baseClass + ' from \'./' + options.baseClass + '\';';
    }

    return {
      importStatement: importStatement,
      baseClass: baseClass
    };
  }
};

