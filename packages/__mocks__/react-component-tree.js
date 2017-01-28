const mock = {
  injectState: jest.fn(),
  __setStateMock: state => {
    mock.serialize = jest.fn(() => (state ? { state } : {}));
  },
};

module.exports = mock;
