let returnMock;

const middleware = jest.fn(() => returnMock);

middleware.__setMock = ((mock) => {
  returnMock = mock;
});

module.exports = middleware;
