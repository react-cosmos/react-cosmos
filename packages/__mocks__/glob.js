let mockPaths = [];

module.exports = {
  __setMockPaths: (paths) => {
    mockPaths = paths.slice(); // Poor man's clone
  },
  sync: jest.fn(() => mockPaths.shift() || []),
};
