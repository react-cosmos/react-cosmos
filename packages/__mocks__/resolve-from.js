let moduleMocks = {};

module.exports = {
  __setMocks: mocks => {
    moduleMocks = mocks;
  },
  silent: jest.fn((fromDir, moduleId) => moduleMocks[moduleId])
};
