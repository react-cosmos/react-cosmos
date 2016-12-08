let parseQueryMock;

module.exports = {
  parseQuery: jest.fn(() => parseQueryMock),
  __setParseQueryMocks: (mock) => {
    parseQueryMock = mock;
  },
};
