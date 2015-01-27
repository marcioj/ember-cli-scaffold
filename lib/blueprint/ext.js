var fs          = require('fs-extra');
var Blueprint   = require('ember-cli/lib/models/blueprint');

module.exports = {
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
