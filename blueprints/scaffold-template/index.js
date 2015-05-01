/*jshint node:true*/

var path = require('path');
var inflection  = require('inflection');
var entityAttrs = require('../../lib/utilities/entity').entityAttrs;
var buildNaming = require('../../lib/utilities/entity').buildNaming;

var filesToPodFilesMapping = {
  '__root__/__path__/__name__/-form.hbs': '__root__/__path__/-form/__name__.hbs',
  '__root__/__path__/__name__/edit.hbs': '__root__/__path__/edit/__name__.hbs',
  '__root__/__path__/__name__/index.hbs': '__root__/__path__/index/__name__.hbs',
  '__root__/__path__/__name__/new.hbs': '__root__/__path__/new/__name__.hbs',
  '__root__/__path__/__name__/show.hbs': '__root__/__path__/show/__name__.hbs'
};

module.exports = {
  description: 'Generates a template.',
  fileMapTokens: function(options) {
    return {
      __name__: function(options) {
        if (options.pod && options.hasPathToken) {
          return 'template';
        }
        return inflection.pluralize(options.dasherizedModuleName);
      },
      __path__: function(options) {
        var blueprintName = 'template';

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

