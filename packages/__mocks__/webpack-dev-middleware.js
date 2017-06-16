let returnMocks;

const middleware = jest.fn(() => returnMocks.shift());

middleware.__setMocks = (mocks => {
  returnMocks = mocks;
});

module.exports = middleware;
