import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;
var originalConfirm;
var confirmCalledWith;

function defineFixturesFor(name, fixtures) {
  var modelClass = App.__container__.lookupFactory('model:' + name);
  modelClass.FIXTURES = fixtures;
}

module('Acceptance: <%= classifiedModuleName %>', {
  setup: function() {
    App = startApp();
    defineFixturesFor('<%= dasherizedModuleName %>', []);
    originalConfirm = window.confirm;
    window.confirm = function() {
      confirmCalledWith = [].slice.call(arguments);
      return true;
    };
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    window.confirm = originalConfirm;
    confirmCalledWith = null;
  }
});

test('visiting /<%= dasherizedModuleNamePlural %> without data', function() {
  visit('/<%= dasherizedModuleNamePlural %>');

  andThen(function() {
    equal(currentPath(), '<%= dasherizedModuleNamePlural %>.index');
    equal(find('#blankslate').text().trim(), 'No <%= humanizedModuleNamePlural %> found');
  });
});

test('visiting /<%= dasherizedModuleNamePlural %> with data', function() {
  defineFixturesFor('<%= dasherizedModuleName %>', [<%= sampleData %>]);
  visit('/<%= dasherizedModuleNamePlural %>');

  andThen(function() {
    equal(currentPath(), '<%= dasherizedModuleNamePlural %>.index');
    equal(find('#blankslate').length, 0);
    equal(find('table tbody tr').length, 1);
  });
});

test('create a new <%= dasherizedModuleName %>', function() {
  visit('/<%= dasherizedModuleNamePlural %>');
  click('a:contains(New <%= humanizedModuleName %>)');

  andThen(function() {
    equal(currentPath(), '<%= dasherizedModuleNamePlural %>.new');
<% attrs.forEach(function(attr) { %>
    fillIn('label:contains(<%= attr.label %>) input', <%= attr.sampleValue %>);<% }); %>

    click('input:submit');
  });

  andThen(function() {
    equal(find('#blankslate').length, 0);
    equal(find('table tbody tr').length, 1);
  });
});

test('update an existing <%= dasherizedModuleName %>', function() {
  defineFixturesFor('<%= dasherizedModuleName %>', [{ id: 1 }]);
  visit('/<%= dasherizedModuleNamePlural %>');
  click('a:contains(Edit)');

  andThen(function() {
    equal(currentPath(), '<%= dasherizedModuleNamePlural %>.edit');
<% attrs.forEach(function(attr) { %>
    fillIn('label:contains(<%= attr.label %>) input', <%= attr.sampleValue %>);<% }); %>

    click('input:submit');
  });

  andThen(function() {
    equal(find('#blankslate').length, 0);
    equal(find('table tbody tr').length, 1);
  });
});

test('show an existing <%= dasherizedModuleName %>', function() {
  defineFixturesFor('<%= dasherizedModuleName %>', [<%= sampleData %>]);
  visit('/users');
  click('a:contains(Show)');

  andThen(function() {
    equal(currentPath(), '<%= dasherizedModuleNamePlural %>.show');
<% attrs.forEach(function(attr) { %>
    equal(find('p strong:contains(<%= attr.label %>:)').next().text(), <%= attr.sampleValue %>);<% }); %>
  });
});

test('delete a <%= dasherizedModuleName %>', function() {
  defineFixturesFor('<%= dasherizedModuleName %>', [<%= sampleData %>]);
  visit('/<%= dasherizedModuleNamePlural %>');
  click('a:contains(Remove)');

  andThen(function() {
    equal(currentPath(), '<%= dasherizedModuleNamePlural %>.index');
    deepEqual(confirmCalledWith, ['Are you sure?']);
    equal(find('#blankslate').length, 1);
  });
});
