var MockUI            = require('ember-cli/tests/helpers/mock-ui');
var MockProject       = require('ember-cli/tests/helpers/mock-project');
var Blueprint         = require('ember-cli/lib/models/blueprint');
var Promise           = require('ember-cli/lib/ext/promise');
var root              = process.cwd();
var rimraf            = Promise.denodeify(require('rimraf'));
var assert            = require('assert');
var path              = require('path');
var fs                = require('fs-extra');
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
});
