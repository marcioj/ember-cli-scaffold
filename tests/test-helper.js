'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var root = process.cwd();
var projectRoot = path.join(root, 'tmp');
var lookupPath = path.join(root, 'blueprints');

module.exports.projectRoot = projectRoot;

module.exports.lookupPath = lookupPath;

module.exports.fixturePath = function fixturePath(fileName) {
  return path.join(root, 'tests', 'fixtures', fileName);
};

module.exports.projectPath = function projectPath(/* paths ... */) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(projectRoot);
  return path.join.apply(path, args);
};

function fileEqual(actual, expected, message) {
  var actualFile = fs.readFileSync(actual, 'utf8');
  var expectedFile = fs.readFileSync(expected, 'utf8');
  assert.equal(actualFile.trim(), expectedFile.trim(), message);
}

assert.fileEqual = fileEqual;
