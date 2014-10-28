import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    save: function() {
      var route = this;
      this.currentModel.save().then(function() {
        // TODO pluralize properly
        route.transitionTo('<%= dasherizedModuleName %>s.index');
      }, function() {
        console.log('Failed to save model user');
      });
    }
  },
  deactivate: function() {
    this.currentModel.rollback();
  }
});
