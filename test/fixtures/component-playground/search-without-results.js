import _ from 'lodash';
import fixture from './selected-fixture-with-search.js';

module.exports = _.merge({}, fixture, {
  component: '',
  fixture: '',
  state: {
    searchText: 'foobar',
  },
});
