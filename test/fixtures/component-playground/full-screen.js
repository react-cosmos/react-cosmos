let _ = require('lodash'),
  defaultFixture = require('./selected-fixture.js');

module.exports = _.merge({}, defaultFixture, {
  fullScreen: true,
});
