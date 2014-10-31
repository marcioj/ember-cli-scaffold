import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    save: function() {
      var route = this;
      this.currentModel.save().then(function() {
        route.transitionTo(route.routeName.split('.')[0]);
      }, function() {
        console.log('Failed to save the model');
      });
    }
  },
  deactivate: function() {
    this.currentModel.rollback();
  }
});
