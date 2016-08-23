var _ = require('lodash'),
    defaultFixture = require('./selected-fixture.js');

module.exports = _.merge({}, defaultFixture, {
  editor: true,
  state: {
    isEditorFocused: true
  }
});
