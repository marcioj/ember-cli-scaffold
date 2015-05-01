/*jshint node:true*/

var path = require('path');
var inflection  = require('inflection');
var entityAttrs = require('../../lib/utilities/entity').entityAttrs;
var sampleDataFromAttrs = require('../../lib/utilities/entity').sampleDataFromAttrs;
var buildNaming = require('../../lib/utilities/entity').buildNaming;

module.exports = {
  description: 'Generates an acceptance test for a resource.',
  fileMapTokens: function(options) {
    return {
      __name__: function(options) {
        if (options.pod && options.hasPathToken) {
          return 'acceptance-test';
        }
        return inflection.pluralize(options.dasherizedModuleName);
      },
      __path__: function(options) {
        var blueprintName = 'acceptance-test';

        if(blueprintName.match(/-test/)) {
          blueprintName = blueprintName.slice(0, blueprintName.indexOf('-test'));
        }
        if (options.pod && options.hasPathToken) {
          return path.join(options.podPath, inflection.pluralize(options.dasherizedModuleName));
        }
        return inflection.pluralize(blueprintName);
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
  }
};

