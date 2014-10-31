# Ember-cli-scaffold

>  Scaffolds models, routes and templates a la rails

[![Build Status][travis_badge]][travis]

## Installation

* `npm install --save-dev ember-cli-scaffold`

## Running

* `ember generate scaffold user first_name:string last_name:string age:number`

Will generate the following files:

- app/mixins/save-model-mixin.js
- app/routes/users/edit.js
- app/routes/users/index.js
- app/routes/users/new.js
- app/templates/users/_form.hbs
- app/templates/users/edit.hbs
- app/templates/users/index.hbs
- app/templates/users/new.hbs
- app/templates/users/show.hbs
- app/models/user.js

## Running Tests

* `npm test`

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

[travis]: https://travis-ci.org/marcioj/ember-cli-scaffold
[travis_badge]: https://api.travis-ci.org/marcioj/ember-cli-scaffold.svg?branch=master
