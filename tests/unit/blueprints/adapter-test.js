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
var testHelper        = require('../test-helper');
var projectPath       = testHelper.projectPath;
var fixturePath       = testHelper.fixturePath;
var lookupPath        = testHelper.lookupPath;
var projectRoot       = testHelper.projectRoot;

describe('Unit: scaffold adapter', function() {
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
    blueprint = Blueprint.lookup('scaffold-adapter', options);
  });

  afterEach(function() {
    return remove(projectRoot);
  });

  describe('install', function() {

    it('installs the resource adapter', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'adapters')).sort();

        assert.deepEqual(files, ['user.js']);
        assert.fileEqual(fixturePath('fixture-adapter'), projectPath('app', 'adapters', 'user.js'));
      });
    });

  });

  describe('install pods', function() {

    it('installs the adapter', function() {
      options.pod = true;
      options.entity.name = 'post';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'post')).sort();

        assert.deepEqual(files, ['adapter.js']);
      });
    });

  });

  describe('uninstall', function() {

    it('uninstalls the resrouce adapter', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      fs.ensureFileSync(projectPath('app', 'adapters', 'user.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'adapters')).sort();

        assert.deepEqual(files, []);
      });
    });

  });

});
