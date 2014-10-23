var MockUI            = require('ember-cli/tests/helpers/mock-ui');
var MockProject       = require('ember-cli/tests/helpers/mock-project');
var Blueprint         = require('ember-cli/lib/models/blueprint');
var Promise           = require('ember-cli/lib/ext/promise');
var root              = process.cwd();
var tmp               = require('tmp-sync');
var rimraf            = Promise.denodeify(require('rimraf'));
var assert            = require('assert');
var path              = require('path');
var tmproot           = path.join(root, 'tmp');
var lookupPath        = path.join(root, 'blueprints');

describe('basic blueprint installation', function() {
  var blueprint;
  var tmpdir;
  var options;

  beforeEach(function() {
    var ui        = new MockUI();
    var project   = new MockProject();
    options   = {
      ui: ui,
      project: project,
      target: tmpdir,
      paths: [lookupPath]
    };
    tmpdir    = tmp.in(tmproot);
    blueprint = Blueprint.lookup('scaffold', options);
  });

  afterEach(function() {
    return rimraf(tmproot);
  });

  it('works', function() {
    return blueprint.install(options).then(function() {
      assert.ok(true);
    });
  });
});
