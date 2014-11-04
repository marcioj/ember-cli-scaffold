var MockUI            = require('ember-cli/tests/helpers/mock-ui');
var MockProject       = require('ember-cli/tests/helpers/mock-project');
var Blueprint         = require('ember-cli/lib/models/blueprint');
var Promise           = require('ember-cli/lib/ext/promise');
var root              = process.cwd();
var rimraf            = Promise.denodeify(require('rimraf'));
var assert            = require('assert');
var path              = require('path');
var fs                = require('fs-extra');
var walkSync          = require('walk-sync');
var tmproot           = path.join(root, 'tmp');
var lookupPath        = path.join(root, 'blueprints');

describe('scaffold blueprint', function() {
  var blueprint;
  var options;
  var entityName;

  beforeEach(function() {
    var ui = new MockUI();
    var project = new MockProject();
    options   = {
      entity: { name: null },
      ui: ui,
      project: project,
      target: tmproot,
      paths: [lookupPath]
    };
    blueprint = Blueprint.lookup('scaffold', options);
  });

  afterEach(function() {
    return rimraf(tmproot);
  });

  describe('install', function() {

    it('add the resource definition to router.js', function() {
      options.entity.name = 'user';
      var sourceFile = path.join(root, 'tests', 'fixtures', 'empty-router');
      var targetFile = path.join(tmproot, 'app', 'router.js');
      fs.copySync(sourceFile, targetFile);

      return blueprint.install(options).then(function() {
        var routerJsContent = fs.readFileSync(targetFile , 'utf8');
        var expected = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'router-with-users-resource'), 'utf8');

        assert.equal(routerJsContent, expected);
      });
    });

    it('add the resource definition to router.js when others routes exist', function() {
      options.entity.name = 'foo';
      var sourceFile = path.join(root, 'tests', 'fixtures', 'router-with-users-resource');
      var targetFile = path.join(tmproot, 'app', 'router.js');
      fs.copySync(sourceFile, targetFile);

      return blueprint.install(options).then(function() {
        var routerJsContent = fs.readFileSync(targetFile , 'utf8');
        var expected = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'router-with-foos-users-resource'), 'utf8');

        assert.equal(routerJsContent, expected);
      });
    });

    it('not add the same resource twice', function() {
      options.entity.name = 'user';
      var sourceFile = path.join(root, 'tests', 'fixtures', 'router-with-users-resource');
      var targetFile = path.join(tmproot, 'app', 'router.js');
      fs.copySync(sourceFile, targetFile);

      return blueprint.install(options).then(function() {
        var routerJsContent = fs.readFileSync(targetFile , 'utf8');
        var expected = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'router-with-users-resource'), 'utf8');

        assert.equal(routerJsContent, expected);
      });
    });

    it('installs the resourcefull routes', function() {
      options.entity.name = 'bro';

      return blueprint.install(options).then(function() {
        var files = walkSync(path.join(tmproot, 'app', 'routes')).sort();

        assert.deepEqual(files, ['bros/','bros/edit.js','bros/index.js','bros/new.js']);
      });
    });

    it('installs the save-model-mixin mixin', function() {
      options.entity.name = 'whatever';

      return blueprint.install(options).then(function() {
        var files = walkSync(path.join(tmproot, 'app', 'mixins')).sort();
        var actualContent = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'save-model-mixin'), 'utf8');
        var expectedContent = fs.readFileSync(path.join(tmproot, 'app', 'mixins', 'save-model-mixin.js'), 'utf8');

        assert.deepEqual(files, ['save-model-mixin.js']);
        assert.deepEqual(actualContent, expectedContent);
      });
    });

    it('installs the model', function() {
      options.entity.name = 'post';

      return blueprint.install(options).then(function() {
        var files = walkSync(path.join(tmproot, 'app', 'models')).sort();

        assert.deepEqual(files, ['post.js']);
      });
    });

    it('installs the templates', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      return blueprint.install(options).then(function() {
        var files = walkSync(path.join(tmproot, 'app', 'templates')).sort();

        assert.deepEqual(files, ['users/', 'users/-form.hbs', 'users/edit.hbs', 'users/index.hbs', 'users/new.hbs', 'users/show.hbs']);

        var expectedShowTemplate = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'show-template'), 'utf8');
        var showTemplate = fs.readFileSync(path.join(tmproot, 'app', 'templates', 'users', 'show.hbs'), 'utf8');

        assert.equal(showTemplate, expectedShowTemplate);

        var expectedNewTemplate = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'new-template'), 'utf8');
        var newTemplate = fs.readFileSync(path.join(tmproot, 'app', 'templates', 'users', 'new.hbs'), 'utf8');

        assert.equal(newTemplate, expectedNewTemplate);

        var expectedIndexTemplate = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'index-template'), 'utf8');
        var indexTemplate = fs.readFileSync(path.join(tmproot, 'app', 'templates', 'users', 'index.hbs'), 'utf8');

        assert.equal(indexTemplate, expectedIndexTemplate);

        var expectedEditTemplate = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'edit-template'), 'utf8');
        var editTemplate = fs.readFileSync(path.join(tmproot, 'app', 'templates', 'users', 'edit.hbs'), 'utf8');

        assert.equal(editTemplate, expectedEditTemplate);

        var expectedFormTemplate = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'form-template'), 'utf8');
        var formTemplate = fs.readFileSync(path.join(tmproot, 'app', 'templates', 'users', '-form.hbs'), 'utf8');

        assert.equal(formTemplate, expectedFormTemplate);

        var expectedAcceptanceTest = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'user-acceptance-test'), 'utf8');
        var acceptanceTest = fs.readFileSync(path.join(tmproot, 'tests', 'acceptance', 'users-test.js'), 'utf8');

        assert.equal(acceptanceTest, expectedAcceptanceTest);
      });
    });

  });

  describe('uninstall', function() {

    it('removes the resource definition from router.js', function() {
      options.entity.name = 'user';
      var sourceFile = path.join(root, 'tests', 'fixtures', 'router-with-users-resource');
      var targetFile = path.join(tmproot, 'app', 'router.js');
      fs.copySync(sourceFile, targetFile);

      return blueprint.uninstall(options).then(function() {
        var routerJsContent = fs.readFileSync(targetFile , 'utf8');
        var expected = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'empty-router'), 'utf8');

        assert.equal(routerJsContent, expected);
      });
    });

    it('not affect other resources in router.js', function() {
      options.entity.name = 'foo';
      var sourceFile = path.join(root, 'tests', 'fixtures', 'router-with-users-resource');
      var targetFile = path.join(tmproot, 'app', 'router.js');
      fs.copySync(sourceFile, targetFile);

      return blueprint.uninstall(options).then(function() {
        var routerJsContent = fs.readFileSync(targetFile , 'utf8');
        var expected = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'router-with-users-resource'), 'utf8');

        assert.equal(routerJsContent, expected);
      });
    });

    it('uninstalls the resourcefull routes', function() {
      options.entity.name = 'bro';

      ['edit.js','index.js','new.js'].forEach(function(file) {
        fs.ensureFileSync(path.join(tmproot, 'app', 'routes', 'bros', file));
      });

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(path.join(tmproot, 'app', 'routes')).sort();

        assert.deepEqual(files, ['bros/']);
      });
    });

    it('uninstalls the save-model-mixin mixin', function() {
      options.entity.name = 'whatever';

      fs.ensureFileSync(path.join(tmproot, 'app', 'mixins', 'save-model-mixin.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(path.join(tmproot, 'app', 'mixins')).sort();

        assert.deepEqual(files, []);
      });
    });

    it('uninstalls the model', function() {
      options.entity.name = 'user';

      fs.ensureFileSync(path.join(tmproot, 'app', 'models', 'user.js'));

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(path.join(tmproot, 'app', 'models')).sort();

        assert.deepEqual(files, []);
      });
    });

    it('uninstalls the templates', function() {
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      ['-form.hbs', 'new.hbs', 'index.hbs', 'edit.hbs', 'show.hbs'].forEach(function(template) {
        fs.ensureFileSync(path.join(tmproot, 'app', 'templates', 'users', template));
      });

      return blueprint.uninstall(options).then(function() {
        var files = walkSync(path.join(tmproot, 'app', 'templates')).sort();

        assert.deepEqual(files, ['users/']);
      });
    });

  });

});
