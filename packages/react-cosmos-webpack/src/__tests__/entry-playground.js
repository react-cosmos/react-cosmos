const mockStartPlayground = jest.fn();

jest.mock('react-cosmos', () => ({
  startPlayground: mockStartPlayground,
}));

// The entry file runs immediately when imported, so we can't import it before
// setting up all mocks
require('../entry-playground');

const options = mockStartPlayground.mock.calls[0][0];

test('starts playground', () => {
  expect(mockStartPlayground).toHaveBeenCalled();
});

test('sends fixtures to playground', () => {
  // Mocked in jest.config.js
  expect(options.fixtures).toEqual({
    foo: 'bar'
  });
});

test('sends loaderUri to playground', () => {
  expect(options.loaderUri).toBe('./loader/index.html');
});
