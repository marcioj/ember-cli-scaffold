import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

function defineFixturesFor(name, fixtures) {
  var modelClass = App.__container__.lookupFactory('model:' + name);
  modelClass.FIXTURES = fixtures;
}

module('Acceptance: <%= classifiedModuleName %>', {
  setup: function() {
    App = startApp();
    defineFixturesFor('<%= dasherizedModuleName %>', []);
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /<%= dasherizedModuleNamePlural %> without data', function() {
  visit('/<%= dasherizedModuleNamePlural %>');

  andThen(function() {
    equal(currentPath(), '<%= dasherizedModuleNamePlural %>.index');
    equal(find('#blankslate').text().trim(), 'No <%= humanizedModuleNamePlural %> found');
  });
});
