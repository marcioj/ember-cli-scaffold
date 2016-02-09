import Ember from 'ember';
import SaveModelMixin from '<%= modulePrefix %>/mixins/<%= dasherizedModuleNamePlural %>/save-model-mixin';

export default Ember.Route.extend(SaveModelMixin, {
  model: function() {
    return this.store.createRecord('<%= dasherizedModuleName %>');
  }
});
