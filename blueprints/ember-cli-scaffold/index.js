module.exports = {
  normalizeEntityName: function() {
  },
  afterInstall: function() {
    return this.addAddonToProject({ name: 'ember-cli-mirage', target: '0.1.x' });
  }
};
