/*jshint node:true*/

var path = require('path');
var inflection  = require('inflection');
var entityAttrs = require('../../lib/utilities/entity').entityAttrs;
var buildNaming = require('../../lib/utilities/entity').buildNaming;

var filesToPodFilesMapping = {
  '__root__/__path__/__name__/edit.js': '__root__/__path__/edit/__name__.js',
  '__root__/__path__/__name__/index.js': '__root__/__path__/index/__name__.js',
  '__root__/__path__/__name__/new.js': '__root__/__path__/new/__name__.js'
};

module.exports = {
  description: 'Generates the routes.',
  fileMapTokens: function(options) {
    return {
      __name__: function(options) {
        if (options.pod && options.hasPathToken) {
          return 'route';
        }
        return inflection.pluralize(options.dasherizedModuleName);
      },
      __path__: function(options) {
        var blueprintName =  'route';

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
    var locals = buildNaming(options.entity.name);
    locals.attrs = attrs;
    return locals;
  },
  mapFile: function(file, locals) {
    var fileMap = locals.fileMap;

    if (this. pod) {
      file = filesToPodFilesMapping[file] || file;
    }
    for (var i in fileMap) {
      var pattern = new RegExp(i, 'g');
      file = file.replace(pattern, fileMap[i]);
    }
    return file;
  }
};

