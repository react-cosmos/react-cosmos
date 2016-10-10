module.exports = {
  realpathSync: jest.fn((path) => `/path/to/project/${path}`),
};
