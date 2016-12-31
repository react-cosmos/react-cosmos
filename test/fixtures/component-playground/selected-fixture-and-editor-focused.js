const selectedFixture = require('./selected-fixture');

module.exports = { ...selectedFixture,
  editor: true,
  state: {
    isEditorFocused: true,
  },
};
