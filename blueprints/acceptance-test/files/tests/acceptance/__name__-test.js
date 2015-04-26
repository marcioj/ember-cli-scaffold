import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;
var originalConfirm;
var confirmCalledWith;

function defineFixturesFor(name, fixtures) {
  var modelClass = application.__container__.lookupFactory('model:' + name);
  modelClass.FIXTURES = fixtures;
}

module('Acceptance: <%= classifiedModuleName %>', {
  beforeEach: function() {
    application = startApp();
    defineFixturesFor('<%= dasherizedModuleName %>', []);
    originalConfirm = window.confirm;
    window.confirm = function() {
      confirmCalledWith = [].slice.call(arguments);
      return true;
    };
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
    window.confirm = originalConfirm;
    confirmCalledWith = null;
  }
});

test('visiting /<%= dasherizedModuleNamePlural %> without data', function(assert) {
  visit('/<%= dasherizedModuleNamePlural %>');

  andThen(function() {
    assert.equal(currentPath(), '<%= dasherizedModuleNamePlural %>.index');
    assert.equal(find('#blankslate').text().trim(), 'No <%= humanizedModuleNamePlural %> found');
  });
});

test('visiting /<%= dasherizedModuleNamePlural %> with data', function(assert) {
  defineFixturesFor('<%= dasherizedModuleName %>', [<%= sampleData %>]);
  visit('/<%= dasherizedModuleNamePlural %>');

  andThen(function() {
    assert.equal(currentPath(), '<%= dasherizedModuleNamePlural %>.index');
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('create a new <%= dasherizedModuleName %>', function(assert) {
  visit('/<%= dasherizedModuleNamePlural %>');
  click('a:contains(New <%= humanizedModuleName %>)');

  andThen(function() {
    assert.equal(currentPath(), '<%= dasherizedModuleNamePlural %>.new');
<% attrs.forEach(function(attr) { %>
    fillIn('label:contains(<%= attr.label %>) input', <%= attr.sampleValue %>);<% }); %>

    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('update an existing <%= dasherizedModuleName %>', function(assert) {
  defineFixturesFor('<%= dasherizedModuleName %>', [{ id: 1 }]);
  visit('/<%= dasherizedModuleNamePlural %>');
  click('a:contains(Edit)');

  andThen(function() {
    assert.equal(currentPath(), '<%= dasherizedModuleNamePlural %>.edit');
<% attrs.forEach(function(attr) { %>
    fillIn('label:contains(<%= attr.label %>) input', <%= attr.sampleValue %>);<% }); %>

    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('show an existing <%= dasherizedModuleName %>', function(assert) {
  defineFixturesFor('<%= dasherizedModuleName %>', [<%= sampleData %>]);
  visit('/<%= dasherizedModuleNamePlural %>');
  click('a:contains(Show)');

  andThen(function() {
    assert.equal(currentPath(), '<%= dasherizedModuleNamePlural %>.show');
<% attrs.forEach(function(attr) { %>
    assert.equal(find('p strong:contains(<%= attr.label %>:)').next().text(), <%= attr.sampleValue %>);<% }); %>
  });
});

test('delete a <%= dasherizedModuleName %>', function(assert) {
  defineFixturesFor('<%= dasherizedModuleName %>', [<%= sampleData %>]);
  visit('/<%= dasherizedModuleNamePlural %>');
  click('a:contains(Remove)');

  andThen(function() {
    assert.equal(currentPath(), '<%= dasherizedModuleNamePlural %>.index');
    assert.deepEqual(confirmCalledWith, ['Are you sure?']);
    assert.equal(find('#blankslate').length, 1);
  });
});
