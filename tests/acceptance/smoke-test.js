var path = require('path');
var fs = require('fs-extra');
var runCommand = require('ember-cli/tests/helpers/run-command');
var Promise = require('ember-cli/lib/ext/promise');
var remove = Promise.denodeify(fs.remove);
var testHelper = require('../test-helper');
var setupTestApp = testHelper.setupTestApp;
var projectRoot = testHelper.projectRoot;
var root = process.cwd();

describe('Acceptance: scaffold smoke test', function() {
  this.timeout(450000);

  function ember(command) {
    var cliPath = path.join('node_modules', 'ember-cli', 'bin', 'ember');
    return runCommand.apply(null, [cliPath].concat(command.split(' ')));
  }

  beforeEach(function() {
    return setupTestApp('my-app');
  });

  afterEach(function() {
    process.chdir(root);
    return remove(projectRoot);
  });

  it('tests pass', function() {
    return ember('generate scaffold user name:string age:number').then(function() {
      return ember('test');
    });
  });
});
