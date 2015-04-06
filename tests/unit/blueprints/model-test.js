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

describe('overrided model blueprint', function() {
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
      paths: [lookupPath]
    };
    blueprint = Blueprint.lookup('model', options);
  });

  afterEach(function() {
    return remove(projectRoot);
  });

  describe('install', function() {

    it('overrides the model blueprint to generate with fixtures array', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };
      var targetFile = projectPath('app', 'models', 'user.js');

      return blueprint.install(options).then(function() {
        assert.fileEqual(targetFile, fixturePath('overrided-model-with-fixtures-array'));
      });
    });

  });

  describe('uninstall', function() {

    it('removes the generated model', function() {
      options.entity.name = 'user';
      var targetFile = projectPath('app', 'models', 'user.js');
      fs.copySync(fixturePath('overrided-model-with-fixtures-array'), targetFile);

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'models'));
        assert.deepEqual(files, []);
      });
    });

  });

});
