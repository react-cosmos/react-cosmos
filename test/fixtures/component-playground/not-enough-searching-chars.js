import _ from 'lodash';
import fixture from './search-without-results.js';

module.exports = _.merge({}, fixture, {
  state: {
    searchText: 'i',
  },
});
