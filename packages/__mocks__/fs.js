let mockRootPath;

module.exports = {
  realpathSync: jest.fn((path) => `${mockRootPath}${path}`),
  __setMockRootPath: (rootPath) => {
    mockRootPath = rootPath;
  },
};
