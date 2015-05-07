'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs-extra');
var root = process.cwd();
var projectRoot = require('os').tmpDir();
var lookupPath = path.join(root, 'blueprints');
var runCommand = require('ember-cli/tests/helpers/run-command');

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

function updatePackageJson(packagePath, func) {
  var contents = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }));
  func(contents);
  fs.writeFileSync(packagePath, JSON.stringify(contents, null, 2));
}

module.exports.setupTestApp = function setupTestApp(name) {
  process.chdir(projectRoot);
  return runCommand(path.join(root, 'node_modules', 'ember-cli', 'bin', 'ember'), 'new', name, '--skip-git', '--skip-npm').then(function() {
    process.chdir(path.join('.', name));
    return runCommand('npm', 'install').then(function() {
      updatePackageJson(path.join(process.cwd(), 'package.json'), function(contents) {
        contents.devDependencies['ember-cli-scaffold'] = '*';
      });
      fs.symlinkSync(root, path.join('node_modules', 'ember-cli-scaffold'));
    });
  });
};
