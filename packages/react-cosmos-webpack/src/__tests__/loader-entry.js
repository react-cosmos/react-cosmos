import mountLoader from 'react-cosmos-loader';
import '../loader-entry';

jest.mock('react-cosmos-loader', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../user-modules', () => ({
  default: jest.fn(() => ({
    proxies: '__mock_proxies__',
    components: '__mock_components__',
    fixtures: '__mock_fixtures__',
  })),
}));

const options = mountLoader.mock.calls[0][0];

test('starts loader', () => {
  expect(mountLoader).toHaveBeenCalled();
});

test('sends proxies to loader', () => {
  expect(options.proxies).toBe('__mock_proxies__');
});

test('sends components to loader', () => {
  expect(options.components).toBe('__mock_components__');
});

test('sends fixtures to loader', () => {
  expect(options.fixtures).toBe('__mock_fixtures__');
});

test('sends containerQuerySelector to loader', () => {
  // Mocked in jest.config.js
  expect(options.containerQuerySelector).toBe('__mock__containerQuerySelector');
});
