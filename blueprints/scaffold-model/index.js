/*jshint node:true*/

var inflection  = require('inflection');
var path = require('path');

module.exports = {
  description: 'Generates an ember-data model.',

  anonymousOptions: [
    'name',
    'attr:type'
  ],

  fileMapTokens: function(options) {
    return {
      __name__: function(options) {
        if (options.pod && options.hasPathToken) {
          return 'model';
        }
        return options.dasherizedModuleName;
      },
      __path__: function(options) {
        var blueprintName = 'model';

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
    return this.lookupBlueprint('model').locals(options);
  }
};
