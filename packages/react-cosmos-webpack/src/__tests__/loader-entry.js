import { mount, unmount } from 'react-cosmos-loader';
import '../loader-entry';

jest.mock('react-cosmos-loader', () => ({
  __esModule: true,
  mount: jest.fn(),
  unmount: jest.fn()
}));

jest.mock('../user-modules', () => ({
  default: jest.fn(() => ({
    proxies: '__mock_proxies__',
    components: '__mock_components__',
    fixtures: '__mock_fixtures__'
  }))
}));

const options = mount.mock.calls[0][0];

test('unmount prev loader', () => {
  expect(unmount).toHaveBeenCalled();
});

test('starts loader', () => {
  expect(mount).toHaveBeenCalled();
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
