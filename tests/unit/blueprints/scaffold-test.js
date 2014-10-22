var MockUI            = require('ember-cli/helpers/mock-ui');
var MockProject       = require('ember-cli/helpers/mock-project');
var Blueprint         = require('ember-cli/lib/models/blueprint');
var Promise           = require('ember-cli/lib/ext/promise');
var root              = process.cwd();
var tmp               = require('ember-cli/node_modules/tmp-sync');
var rimraf            = Promise.denodeify(require('ember-cli/node_modules/rimraf'));
var assert            = require('assert');
var path              = require('path');
var tmproot           = path.join(root, 'tmp');

describe('basic blueprint installation', function() {
  var blueprint;
  var tmpdir;

  beforeEach(function() {
    var ui        = new MockUI();
    var project   = new MockProject();
    var options   = {
      ui: ui,
      project: project,
      target: tmpdir
    };
    tmpdir    = tmp.in(tmproot);
    blueprint = Blueprint.lookup('scaffold', options);
  });

  afterEach(function() {
    return rimraf(tmproot);
  });

  it('works', function() {
    return blueprint.install().then(function() {
      assert.ok(true);
    });
  });
});
