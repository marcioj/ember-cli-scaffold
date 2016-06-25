#!/usr/bin/env node

// Description: like ember install addon-name but linking from this source code
// Usage: call ./install-local.js from within a ember-cli project

'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;

function sh(command) {
  return exec(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] });
}

function info(msg) {
  console.log(msg);
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path));
}

function writeJson(path, obj) {
  fs.writeFileSync(path, JSON.stringify(obj));
}

var addonName = path.dirname(path.relative('..',  __dirname));
var json = readJson('./package.json');

info(`Linking ${addonName}`);
sh(`npm link ${addonName}`);

info(`Including ${addonName} dependency into package.json`);
json.devDependencies[addonName] = '*';
writeJson('./package.json', json);

info(`Running default addon command`);
sh(`ember generate ${addonName}`);
