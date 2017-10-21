import { mount as mountLoader } from 'react-cosmos-loader';

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
const two = [{ component: Bar }, { component: Bar }];

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
        filePath: '/components/nested/Bar.js',
        name: 'Bar'
      }
    ]
  },
  {
    filePath: '/components/__fixtures__/Bar/nested/two.json',
    components: [
      {
        filePath: '/components/nested/Bar.js',
        name: 'Bar'
      }
    ]
  }
];
const fixtureModules = {
  '/components/__fixtures__/Foo/blank.js': blank,
  '/components/__fixtures__/Bar/one.js': one,
  '/components/__fixtures__/Bar/nested/two.json': two
};

beforeEach(() => {
  global.PROXIES = proxies;
  global.FIXTURE_FILES = fixtureFiles;
  global.FIXTURE_MODULES = fixtureModules;
  global.CONTEXTS = [];
  global.DEPRECATED_COMPONENT_MODULES = [];

  // Require module after globals have been mocked
  require('../../mount').default();
});

it('sends proxies to loader', () => {
  expect(mountLoader.mock.calls[0][0].proxies).toEqual(proxies);
});

test('sends fixtures to loader', () => {
  expect(mountLoader.mock.calls[0][0].fixtures).toEqual({
    // "nested/Bar" is collapsed to "Bar"
    Bar: {
      one,
      'nested/two': two[0],
      'nested/two (1)': two[1]
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
