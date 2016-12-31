const fixture = require('./search-without-results');

module.exports = { ...fixture,
  state: {
    searchText: 'i',
  },
};
