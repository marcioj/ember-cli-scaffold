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

describe('Unit: scaffold acceptance test', function() {
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
    blueprint = Blueprint.lookup('acceptance-test', options);
  });

  afterEach(function() {
    return remove(projectRoot);
  });

  describe('install', function() {

    it('installs the acceptance test', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      return blueprint.install(options).then(function() {
        assert.fileEqual(fixturePath('user-acceptance-test'), projectPath('tests', 'acceptance', 'users-test.js'));
      });
    });

  });

  describe('uninstall', function() {

    it('uninstalls the acceptance test', function() {
      options.entity.name = 'user';

      fs.ensureFileSync(projectPath('tests', 'acceptance', 'users-test.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('tests', 'acceptance'));

        assert.deepEqual(files, []);
      });
    });

  });

});
