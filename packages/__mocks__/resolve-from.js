let moduleMocks = {};

module.exports = {
  __setMocks: mocks => {
    moduleMocks = mocks;
  },
  silent: (fromDir, moduleId) =>
    moduleMocks[moduleId] ? `${fromDir}${moduleMocks[moduleId]}` : null
};
