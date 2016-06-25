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
var sinon             = require('sinon');
var testHelper        = require('../../test-helper');
var projectPath       = testHelper.projectPath;
var fixturePath       = testHelper.fixturePath;
var lookupPath        = testHelper.lookupPath;
var projectRoot       = testHelper.projectRoot;

describe('scaffold blueprint', function() {
  var blueprint;
  var options;
  var entityName;
  var ui;

  beforeEach(function() {
    fs.mkdirsSync(projectRoot);
    ui = new MockUI();
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
    blueprint = Blueprint.lookup('ember-cli-scaffold', options);
    sinon.stub(blueprint, 'addAddonToProject');
  });

  afterEach(function() {
    blueprint.addAddonToProject.restore();
    return remove(projectRoot);
  });

  describe('install', function() {
    it('adds ember-cli-mirage to the project', function() {
      options.entity.name = 'user';
      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('empty-router'), targetFile);

      return blueprint.install(options).then(function() {
        assert.ok(blueprint.addAddonToProject.calledWith('ember-cli-mirage'));
      });
    });

  });

});
