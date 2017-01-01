import selectedFixture from './selected-fixture';

module.exports = { ...selectedFixture,
  editor: true,
  state: {
    isEditorFocused: true,
  },
};
