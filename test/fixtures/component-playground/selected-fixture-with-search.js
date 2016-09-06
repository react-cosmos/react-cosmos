let _ = require('lodash'),
  selectedFixture = require('./selected-fixture.js');

module.exports = _.merge({}, selectedFixture, {
  state: {
    searchText: 'seind',
  },
});
