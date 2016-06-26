'use strict';

var MockUI            = require('ember-cli/tests/helpers/mock-ui');
var MockProject       = require('ember-cli/tests/helpers/mock-project');
var Blueprint         = require('ember-cli/lib/models/blueprint');
var Promise           = require('ember-cli/lib/ext/promise');
var fs                = require('fs-extra');
var sinon             = require('sinon');
var remove            = Promise.denodeify(fs.remove);
var assert            = require('assert');
var path              = require('path');
var walkSync          = require('walk-sync');
var chalk             = require('chalk');
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
    project._config = {
      baseURL: '/',
      locationType: 'auto',
      modulePrefix: 'my-app'
    };

    options = {
      entity: { name: null },
      ui: ui,
      project: project,
      target: projectRoot,
      paths: [lookupPath],
      inRepoAddon: null
    };
    blueprint = Blueprint.lookup('scaffold', options);
    sinon.stub(blueprint, 'invoke').returns(Promise.resolve());
  });

  afterEach(function() {
    assert.ok(blueprint.invoke.calledWith('scaffold-template'));
    assert.ok(blueprint.invoke.calledWith('scaffold-route'));
    assert.ok(blueprint.invoke.calledWith('scaffold-mixin'));
    assert.ok(blueprint.invoke.calledWith('scaffold-acceptance-test'));
    assert.ok(blueprint.invoke.calledWith('model'));
    assert.ok(blueprint.invoke.calledWith('mirage-model'));

    blueprint.invoke.restore();
    return remove(projectRoot);
  });

  describe('install', function() {
    it('add the route definition to router.js', function() {
      options.entity.name = 'user';
      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('empty-router'), targetFile);

      return blueprint.install(options).then(function() {
        assert.fileEqual(targetFile, fixturePath('router-with-users-resource'));
      });
    });

    it('add the route definition to router.js when others routes exist', function() {
      options.entity.name = 'foo';
      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('router-with-users-resource'), targetFile);

      return blueprint.install(options).then(function() {
        assert.fileEqual(targetFile, fixturePath('router-with-foos-users-resource'));
      });
    });

    it('not add the same resource twice', function() {
      options.entity.name = 'user';
      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('router-with-users-resource'), targetFile);

      return blueprint.install(options).then(function() {
        assert.fileEqual(targetFile, fixturePath('router-with-users-resource'));
      });
    });

    it('displays the change in app/router.js', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('empty-router'), targetFile);

      return blueprint.install(options).then(function() {
        assert.ok(ui.output.indexOf(chalk.green('change') + ' app/router.js') !== -1);
      });
    });

    it('displays identical if app/router.js has not changed', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('empty-router'), targetFile);

      return Promise.all([blueprint.install(options), blueprint.install(options)]).then(function() {
        assert.ok(ui.output.indexOf(chalk.yellow('identical') + ' app/router.js') !== -1);
      });
    });

  });

  describe('uninstall', function() {

    it('removes the resource definition from router.js', function() {
      options.entity.name = 'user';
      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('router-with-users-resource'), targetFile);

      return blueprint.uninstall(options).then(function() {
        assert.fileEqual(targetFile, fixturePath('empty-router'));
      });
    });

    it('not affect other resources in router.js', function() {
      options.entity.name = 'foo';
      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('router-with-users-resource'), targetFile);

      return blueprint.uninstall(options).then(function() {
        assert.fileEqual(targetFile, fixturePath('router-with-users-resource'));
      });
    });

    it('displays the change in app/router.js', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('empty-router'), targetFile);

      return blueprint.install(options).then(function() {
        return blueprint.uninstall(options).then(function() {
          assert.ok(ui.output.indexOf(chalk.red('change') + ' app/router.js') !== -1);
        });
      });
    });

    it('displays identical if app/router.js has not changed', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('empty-router'), targetFile);

      return Promise.all([blueprint.install(options), blueprint.install(options)]).then(function() {
        return blueprint.uninstall(options).then(function() {
          assert.ok(ui.output.indexOf(chalk.yellow('identical') + ' app/router.js') !== -1);
        });
      });
    });
  });

});
