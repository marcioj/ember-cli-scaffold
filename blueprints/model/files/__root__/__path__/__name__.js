import DS from 'ember-data';

var <%= classifiedModuleName %> = DS.Model.extend({
  <%= attrs %>
});

<%= classifiedModuleName %>.reopenClass({
  FIXTURES: []
});

export default <%= classifiedModuleName %>;
