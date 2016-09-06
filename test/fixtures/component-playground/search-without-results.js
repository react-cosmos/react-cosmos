let _ = require('lodash'),
  fixture = require('./selected-fixture-with-search.js');

module.exports = _.merge({}, fixture, {
  component: '',
  fixture: '',
  state: {
    searchText: 'foobar',
  },
});
