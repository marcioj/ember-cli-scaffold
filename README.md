# Ember-cli-scaffold

>  Scaffolds models, routes and templates a la rails

[![Build Status][travis_badge]][travis]
[![Ember Observer Score][ember_observer_badge]][ember_observer]

## Installation

In your ember-cli app, do `ember install ember-cli-scaffold`

## Usage

```sh
ember generate scaffold user first_name:string last_name:string age:number
open http://localhost:4200/users
```

This command generates the following files:

- app/adapters/user.js
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
- app/mirage/factories/user.js
- tests/acceptance/users-test.js

These files contain all the CRUD operations and an acceptance test with all tests passing. In order to provide a fake server in both development and tests [ember-cli-mirage](http://www.ember-cli-mirage.com/) is used.

It's also possible to generate using the pod structure, just pass the `-pod` flag to scaffold generator.

To remove the generated files just use the `ember destroy scaffold <model-name>` command. For instance `ember destroy scaffold user`.

## Running Tests

`npm test`

## Contributing

1. Fork it
1. Create your feature branch (`git checkout -b my-new-feature`)
1. Commit your changes (`git commit -am 'Add some feature'`)
1. Push to the branch (`git push origin my-new-feature`)
1. Create new Pull Request

[travis]: https://travis-ci.org/marcioj/ember-cli-scaffold
[travis_badge]: https://api.travis-ci.org/marcioj/ember-cli-scaffold.svg?branch=master
[ember_observer]: http://emberobserver.com/addons/ember-cli-scaffold
[ember_observer_badge]: http://emberobserver.com/badges/ember-cli-scaffold.svg
