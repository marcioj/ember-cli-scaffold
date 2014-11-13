var fs          = require('fs-extra');
var Blueprint   = require('ember-cli/lib/models/blueprint');

module.exports = {
  insertInto: function(file, match, newContent) {
    fs.ensureFileSync(file);
    var fileContent = fs.readFileSync(file, 'utf8');
    if (fileContent.indexOf(newContent) !== -1) {
      return;
    }
    var index = fileContent.indexOf(match);
    if (index !== -1) {
      index = index + match.length;
      fileContent =  fileContent.substring(0, index) + newContent + fileContent.substring(index, fileContent.length);
      fs.writeFileSync(file, fileContent);
    }
  },
  removeFromFile: function(file, match) {
    fs.ensureFileSync(file);
    var fileContent = fs.readFileSync(file, 'utf8');
    var index = fileContent.indexOf(match);
    if (index >= 0) {
      fileContent = fileContent.substring(0, index) + fileContent.substring(index + match.length, fileContent.length);
      fs.writeFileSync(file, fileContent);
    }
  },
  install: function(options) {
    this._operation = 'install';
    this._options = options;
    return this._super.install.apply(this, arguments);
  },
  uninstall: function(options) {
    this._operation = 'uninstall';
    this._options = options;
    return this._super.uninstall.apply(this, arguments);
  },
  invoke: function(name) {
    var blueprint = Blueprint.lookup(name, {
      ui: this.ui,
      analyctics: this.analyctics,
      project: this.project,
      ignoreMissing: true
    });

    return blueprint[this._operation](this._options);
  }
}
