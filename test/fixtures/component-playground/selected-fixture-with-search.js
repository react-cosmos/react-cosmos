import _ from 'lodash';
import selectedFixture from './selected-fixture.js';

module.exports = _.merge({}, selectedFixture, {
  state: {
    searchText: 'seind',
  },
});
