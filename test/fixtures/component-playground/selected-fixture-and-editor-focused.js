import selectedFixture from './selected-fixture.js';

module.exports = { ...selectedFixture,
  editor: true,
  state: {
    isEditorFocused: true,
  },
};
