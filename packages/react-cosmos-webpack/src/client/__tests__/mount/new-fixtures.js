import { mount as mountLoader } from 'react-cosmos-loader';
import mount from '../../mount';

jest.mock('react-cosmos-loader', () => ({
  __esModule: true,
  mount: jest.fn(),
  unmount: jest.fn()
}));

const ProxyA = () => {};
const Foo = () => {};
const Bar = () => {};
const blank = { component: Foo };
const one = { component: Bar };
const two = { component: Bar };

const proxies = [ProxyA];
const fixtureFiles = [
  {
    filePath: '/components/__fixtures__/Foo/blank.js',
    components: [
      {
        filePath: '/components/Foo.js',
        name: 'Foo'
      }
    ]
  },
  {
    filePath: '/components/__fixtures__/Bar/one.js',
    components: [
      {
        filePath: '/components/Bar.js',
        name: 'Bar'
      }
    ]
  },
  {
    filePath: '/components/__fixtures__/Bar/two.json',
    components: [
      {
        filePath: '/components/Bar.js',
        name: 'Bar'
      }
    ]
  }
];
const fixtureModules = {
  '/components/__fixtures__/Foo/blank.js': blank,
  '/components/__fixtures__/Bar/one.js': one,
  '/components/__fixtures__/Bar/two.json': two
};

beforeEach(() => {
  global.PROXIES = proxies;
  global.FIXTURE_FILES = fixtureFiles;
  global.FIXTURE_MODULES = fixtureModules;
  global.CONTEXTS = [];
  global.DEPRECATED_COMPONENT_MODULES = [];

  mount();
});

it('sends proxies to loader', () => {
  expect(mountLoader.mock.calls[0][0].proxies).toEqual(proxies);
});

test('sends components to loader', () => {
  expect(mountLoader.mock.calls[0][0].components).toEqual({
    Bar,
    Foo
  });
});

test('sends fixtures to loader', () => {
  expect(mountLoader.mock.calls[0][0].fixtures).toEqual({
    Bar: {
      one,
      two
    },
    Foo: {
      blank
    }
  });
});

test('sends containerQuerySelector to loader', () => {
  // Mocked in jest.config.js
  expect(mountLoader.mock.calls[0][0].containerQuerySelector).toBe(
    '__mock__containerQuerySelector'
  );
});
