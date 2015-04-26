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

describe('Unit: scaffold save model mixin', function() {
  var blueprint;
  var options;
  var entityName;

  beforeEach(function() {
    var ui = new MockUI();
    var project = new MockProject();
    project.root = projectRoot;

    options   = {
      entity: { name: null },
      ui: ui,
      project: project,
      target: projectRoot,
      paths: [lookupPath],
      inRepoAddon: null
    };
    blueprint = Blueprint.lookup('mixin', options);
  });

  afterEach(function() {
    return remove(projectRoot);
  });

  describe('install', function() {

    it('installs the save-model-mixin mixin', function() {
      options.entity.name = 'whatever';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'mixins', 'whatevers')).sort();

        assert.deepEqual(files, ['save-model-mixin.js']);
        assert.fileEqual(fixturePath('save-model-mixin'), projectPath('app', 'mixins', 'whatevers', 'save-model-mixin.js'));
      });
    });


  });

  describe('uninstall', function() {

    it('uninstalls the save-model-mixin mixin', function() {
      options.entity.name = 'whatever';

      fs.ensureFileSync(projectPath('app', 'mixins', 'whatevers', 'save-model-mixin.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'mixins', 'whatevers'));

        assert.deepEqual(files, []);
      });
    });

  });

});
