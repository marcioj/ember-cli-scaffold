'use strict';

var MockUI            = require('ember-cli/tests/helpers/mock-ui');
var MockProject       = require('ember-cli/tests/helpers/mock-project');
var Blueprint         = require('ember-cli/lib/models/blueprint');
var Promise           = require('ember-cli/lib/ext/promise');
var fs                = require('fs-extra');
var remove            = Promise.denodeify(fs.remove);
var assert            = require('assert');
var path              = require('path');
var walkSync          = require('walk-sync');
var testHelper        = require('../../test-helper');
var projectPath       = testHelper.projectPath;
var fixturePath       = testHelper.fixturePath;
var lookupPath        = testHelper.lookupPath;
var projectRoot       = testHelper.projectRoot;

describe('Unit: scaffold model', function() {
  var blueprint;
  var options;
  var entityName;

  beforeEach(function() {
    var ui = new MockUI();
    var project = new MockProject();
    MockProject.prototype.blueprintLookupPaths = function() {
      return [lookupPath];
    };
    project.root = projectRoot;

    options   = {
      entity: { name: null },
      ui: ui,
      project: project,
      target: projectRoot,
      paths: [lookupPath],
      inRepoAddon: null
    };
    blueprint = Blueprint.lookup('scaffold-model', options);
  });

  afterEach(function() {
    return remove(projectRoot);
  });

  describe('install', function() {

    it('installs the model', function() {
      options.entity.name = 'post';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'models')).sort();

        assert.deepEqual(files, ['post.js']);
      });
    });

    it('overrides the model blueprint to generate with fixtures array', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };
      var targetFile = projectPath('app', 'models', 'user.js');

      return blueprint.install(options).then(function() {
        assert.fileEqual(targetFile, fixturePath('overrided-model-with-fixtures-array'));
      });
    });

  });

  describe('install pods', function() {

    it('installs the model', function() {
      options.pod = true;
      options.entity.name = 'post';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'post')).sort();

        assert.deepEqual(files, ['model.js']);
      });
    });

  });

  describe('uninstall', function() {

    it('uninstalls the model', function() {
      options.entity.name = 'user';

      fs.ensureFileSync(projectPath('app', 'models', 'user.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'models')).sort();

        assert.deepEqual(files, []);
      });
    });

  });

});
