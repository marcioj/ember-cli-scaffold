import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    save: function() {
      var route = this;
      this.currentModel.save().then(function() {
        route.transitionTo('<%= dasherizedModuleNamePlural %>.index');
      }, function() {
        console.log('Failed to save model user');
      });
    }
  },
  deactivate: function() {
    this.currentModel.rollback();
  }
});
