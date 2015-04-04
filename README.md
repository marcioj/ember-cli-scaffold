# Ember-cli-scaffold

>  Scaffolds models, routes and templates a la rails

[![Build Status][travis_badge]][travis]
[![Ember Observer Score][ember_observer_badge]][ember_observer]

## Installation

In your ember-cli app, do `npm install --save-dev ember-cli-scaffold`

Since this addon doesn't install any adapter, the easy way to persist your data is installing the [ember-localstorage-adapter](https://github.com/kurko/ember-localstorage-adapter)

## Running

`ember generate scaffold user first_name:string last_name:string age:number`

Will generate the following files:

- app/mixins/users/save-model-mixin.js
- app/routes/users/edit.js
- app/routes/users/index.js
- app/routes/users/new.js
- app/templates/users/-form.hbs
- app/templates/users/edit.hbs
- app/templates/users/index.hbs
- app/templates/users/new.hbs
- app/templates/users/show.hbs
- app/models/user.js

## Running Tests

`npm test`

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

[travis]: https://travis-ci.org/marcioj/ember-cli-scaffold
[travis_badge]: https://api.travis-ci.org/marcioj/ember-cli-scaffold.svg?branch=master
[ember_observer]: http://emberobserver.com/addons/ember-cli-scaffold
[ember_observer_badge]: http://emberobserver.com/badges/ember-cli-scaffold.svg
