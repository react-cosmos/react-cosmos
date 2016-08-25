var _ = require('lodash'),
    fixture = require('./search-without-results.js');

module.exports = _.merge({}, fixture, {
  state: {
    searchText: 'i'
  }
});
