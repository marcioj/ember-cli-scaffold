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

describe('Unit: scaffold template', function() {
  var blueprint;
  var options;
  var entityName;

  beforeEach(function() {
    fs.mkdirsSync(projectRoot);
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
    blueprint = Blueprint.lookup('scaffold-template', options);
  });

  afterEach(function() {
    return remove(projectRoot);
  });

  describe('install', function() {

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
      });
    });

  });

  describe('install pods', function() {

    it('installs the templates', function() {
      options.pod = true;
      options.entity.name = 'user';
      options.entity.options = { first_name: 'string', last_name: 'string' };

      return blueprint.install(options).then(function() {
        var files = walkSync(projectPath('app', 'users')).sort();

        assert.deepEqual(files, [
          '-form/',
          '-form/template.hbs',
          'edit/',
          'edit/template.hbs',
          'index/',
          'index/template.hbs',
          'new/',
          'new/template.hbs',
          'show/',
          'show/template.hbs'
        ]);

        assert.fileEqual(fixturePath('show-template'), projectPath('app', 'users', 'show', 'template.hbs'));
        assert.fileEqual(fixturePath('new-template'), projectPath('app', 'users', 'new', 'template.hbs'));
        assert.fileEqual(fixturePath('index-template'), projectPath('app', 'users', 'index', 'template.hbs'));
        assert.fileEqual(fixturePath('edit-template'), projectPath('app', 'users', 'edit', 'template.hbs'));
        assert.fileEqual(fixturePath('form-template'), projectPath('app', 'users', '-form', 'template.hbs'));
      });
    });

  });

  describe('uninstall', function() {

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

  });

});
