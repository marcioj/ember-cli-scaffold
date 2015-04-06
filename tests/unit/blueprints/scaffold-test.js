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

describe('scaffold blueprint', function() {
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
      paths: [lookupPath]
    };
    blueprint = Blueprint.lookup('scaffold', options);
  });

  afterEach(function() {
    return remove(projectRoot);
  });

  describe('install', function() {

    it('add the resource definition to router.js', function() {
      options.entity.name = 'user';
      var targetFile = projectPath('app', 'router.js');
      fs.copySync(fixturePath('empty-router'), targetFile);

      return blueprint.install(options).then(function() {
        assert.fileEqual(targetFile, fixturePath('router-with-users-resource'));
      });
    });

    it('add the resource definition to router.js when others routes exist', function() {
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

    it('installs the resourcefull routes', function() {
      options.entity.name = 'bro';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'routes')).sort();

        assert.deepEqual(files, ['bros/','bros/edit.js','bros/index.js','bros/new.js']);
        assert.fileEqual(fixturePath('new-route'), projectPath('app', 'routes', 'bros', 'new.js'));
        assert.fileEqual(fixturePath('edit-route'), projectPath('app', 'routes', 'bros', 'edit.js'));
        assert.fileEqual(fixturePath('index-route'), projectPath('app', 'routes', 'bros', 'index.js'));
      });
    });

    it('installs the save-model-mixin mixin', function() {
      options.entity.name = 'whatever';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'mixins', 'whatevers')).sort();

        assert.deepEqual(files, ['save-model-mixin.js']);
        assert.fileEqual(fixturePath('save-model-mixin'), projectPath('app', 'mixins', 'whatevers', 'save-model-mixin.js'));
      });
    });

    it('installs the model', function() {
      options.entity.name = 'post';

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'models')).sort();

        assert.deepEqual(files, ['post.js']);
      });
    });

    it('installs the templates', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'templates')).sort();

        assert.deepEqual(files, ['users/', 'users/-form.hbs', 'users/edit.hbs', 'users/index.hbs', 'users/new.hbs', 'users/show.hbs']);
        assert.fileEqual(fixturePath('show-template'), projectPath('app', 'templates', 'users', 'show.hbs'));
        assert.fileEqual(fixturePath('new-template'), projectPath('app', 'templates', 'users', 'new.hbs'));
        assert.fileEqual(fixturePath('index-template'), projectPath('app', 'templates', 'users', 'index.hbs'));
        assert.fileEqual(fixturePath('edit-template'), projectPath('app', 'templates', 'users', 'edit.hbs'));
        assert.fileEqual(fixturePath('form-template'), projectPath('app', 'templates', 'users', '-form.hbs'));
        assert.fileEqual(fixturePath('user-acceptance-test'), projectPath('tests', 'acceptance', 'users-test.js'));
      });
    });

    it('installs the application adapter', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'adapters')).sort();

        assert.deepEqual(files, ['application.js']);
        assert.fileEqual(fixturePath('fixture-adapter'), projectPath('app', 'adapters', 'application.js'));
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

    it('uninstalls the resourcefull routes', function() {
      options.entity.name = 'bro';

      ['edit.js','index.js','new.js'].forEach(function(file) {
        fs.ensureFileSync(projectPath('app', 'routes', 'bros', file));
      });

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'routes')).sort();

        assert.deepEqual(files, ['bros/']);
      });
    });

    it('uninstalls the save-model-mixin mixin', function() {
      options.entity.name = 'whatever';

      fs.ensureFileSync(projectPath('app', 'mixins', 'whatevers', 'save-model-mixin.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'mixins', 'whatevers')).sort();

        assert.deepEqual(files, []);
      });
    });

    it('uninstalls the model', function() {
      options.entity.name = 'user';

      fs.ensureFileSync(projectPath('app', 'models', 'user.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'models')).sort();

        assert.deepEqual(files, []);
      });
    });

    it('uninstalls the templates', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      ['-form.hbs', 'new.hbs', 'index.hbs', 'edit.hbs', 'show.hbs'].forEach(function(template) {
        fs.ensureFileSync(projectPath('app', 'templates', 'users', template));
      });

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'templates')).sort();

        assert.deepEqual(files, ['users/']);
      });
    });

    it('uninstalls the application adapter', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      fs.ensureFileSync(projectPath('app', 'adapters', 'application.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(projectPath('app', 'adapters')).sort();

        assert.deepEqual(files, []);
      });
    });

  });

});
