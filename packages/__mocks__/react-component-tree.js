let stateMock;

module.exports = {
  injectState: jest.fn(),
  serialize: jest.fn(() => (stateMock ? { state: stateMock } : {})),
  __setStateMock: (state) => {
    stateMock = state;
  },
};
