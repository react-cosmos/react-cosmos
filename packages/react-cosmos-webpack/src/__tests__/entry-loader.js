const mockStartLoader = jest.fn();
const mockComponents = {};
const mockFixtures = {};
const mockProxies = [];

jest.mock('react-cosmos', () => ({
  startLoader: mockStartLoader
}));

jest.mock('../user-modules', () => ({ default: jest.fn(() => ({
  components: mockComponents,
  fixtures: mockFixtures,
  proxies: mockProxies,
})) }));

// The entry file runs immediately when imported, so we can't import it before
// setting up all mocks
require('../entry-loader');

const options = mockStartLoader.mock.calls[0][0];

test('starts loader', () => {
  expect(mockStartLoader).toHaveBeenCalled();
});

test('sends proxies to loader', () => {
  expect(options.proxies).toBe(mockProxies);
});

test('sends components to loader', () => {
  expect(options.components).toBe(mockComponents);
});

test('sends fixtures to loader', () => {
  expect(options.fixtures).toBe(mockFixtures);
});

test('sends containerQuerySelector to loader', () => {
  // Mocked in jest.config.js
  expect(options.containerQuerySelector).toBe('__mock__containerQuerySelector');
});
