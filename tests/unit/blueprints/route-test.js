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

describe('Unit: scaffold route', function() {
  var blueprint;
  var options;
  var entityName;

  beforeEach(function() {
    fs.mkdirsSync(projectRoot);
    var ui = new MockUI();
    var project = new MockProject();
    project.root = projectRoot;
    project._config = {
      baseURL: '/',
      locationType: 'auto',
      modulePrefix: 'my-app'
    };

    options   = {
      entity: { name: null },
      ui: ui,
      project: project,
      target: projectRoot,
      paths: [lookupPath],
      inRepoAddon: null
    };
    blueprint = Blueprint.lookup('scaffold-route', options);
  });

  afterEach(function() {
    return remove(projectRoot);
  });

  describe('install', function() {

    it('installs the resourceful routes', function() {
      options.entity.name = 'bro';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'routes')).sort();

        assert.deepEqual(files, ['bros/','bros/destroy.js', 'bros/edit.js','bros/index.js','bros/new.js']);
        assert.fileEqual(fixturePath('new-route'), projectPath('app', 'routes', 'bros', 'new.js'));
        assert.fileEqual(fixturePath('edit-route'), projectPath('app', 'routes', 'bros', 'edit.js'));
        assert.fileEqual(fixturePath('destroy-route'), projectPath('app', 'routes', 'bros', 'destroy.js'));
        assert.fileEqual(fixturePath('index-route'), projectPath('app', 'routes', 'bros', 'index.js'));
      });
    });

  });

  describe('install pods', function() {

    it('installs the routes', function() {
      options.pod = true;
      options.entity.name = 'bro';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'bros')).sort();

        assert.deepEqual(files, [
          'destroy/',
          'destroy/route.js',
          'edit/',
          'edit/route.js',
          'index/',
          'index/route.js',
          'new/',
          'new/route.js'
        ]);

        assert.fileEqual(fixturePath('new-route'), projectPath('app', 'bros', 'new', 'route.js'));
        assert.fileEqual(fixturePath('edit-route'), projectPath('app', 'bros', 'edit', 'route.js'));
        assert.fileEqual(fixturePath('destroy-route'), projectPath('app', 'bros', 'destroy', 'route.js'));
        assert.fileEqual(fixturePath('index-route'), projectPath('app', 'bros', 'index', 'route.js'));
      });
    });

  });

  describe('uninstall', function() {

    it('uninstalls the resourceful routes', function() {
      options.entity.name = 'bro';

      ['edit.js','index.js','destroy.js', 'new.js'].forEach(function(file) {
        fs.ensureFileSync(projectPath('app', 'routes', 'bros', file));
      });

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'routes')).sort();

        assert.deepEqual(files, ['bros/']);
      });
    });

  });

});
