import { mount, unmount } from 'react-cosmos-loader';
import '../loader-entry';

jest.mock('react-cosmos-loader', () => ({
  __esModule: true,
  mount: jest.fn(),
  unmount: jest.fn()
}));

jest.mock('../user-modules', () => ({
  default: jest.fn(() => ({
    proxies: { __esModule: true, default: '__PROXIES__' },
    components: {
      Foo: '__FOO_COMPONENT__',
      Bar: { __esModule: true, default: '__BAR_COMPONENT__' }
    },
    fixtures: {
      Foo: { foo: '__FOO_FIXTURE__' },
      Bar: { bar: { __esModule: true, default: '__BAR_FIXTURE__' } }
    }
  }))
}));

const options = mount.mock.calls[0][0];

test('starts loader', () => {
  expect(mount).toHaveBeenCalled();
});

test('sends proxies to loader', () => {
  expect(options.proxies).toBe('__PROXIES__');
});

test('sends CJS component to loader', () => {
  expect(options.components.Foo).toBe('__FOO_COMPONENT__');
});

test('sends ES component to loader', () => {
  expect(options.components.Bar).toBe('__BAR_COMPONENT__');
});

test('sends CJS fixture to loader', () => {
  expect(options.fixtures.Foo.foo).toBe('__FOO_FIXTURE__');
});

test('sends ES fixture to loader', () => {
  expect(options.fixtures.Bar.bar).toBe('__BAR_FIXTURE__');
});

test('sends containerQuerySelector to loader', () => {
  // Mocked in jest.config.js
  expect(options.containerQuerySelector).toBe('__mock__containerQuerySelector');
});
