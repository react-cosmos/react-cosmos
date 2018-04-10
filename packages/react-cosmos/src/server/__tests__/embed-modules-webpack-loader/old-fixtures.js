// Requiring because embed-modules-webpack-loader is a CJS module
const embedModules = require('../../embed-modules-webpack-loader');

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: 'MOCK_ROOT_PATH',
    componentPaths: ['/path/to/components'],
    proxiesPath: require.resolve('../__fsmocks__/cosmos.proxies')
  })
}));

jest.mock('react-cosmos-voyager', () => () => ({
  components: {
    Foo: '/components/Foo.js',
    Bar: '/components/Bar.js'
  },
  fixtures: {
    Foo: {
      blank: '/components/__fixtures__/Foo/blank.js'
    },
    Bar: {
      one: '/components/__fixtures__/Bar/one.js',
      two: '/components/__fixtures__/Bar/two.json'
    }
  }
}));

const mockAddContextDependency = jest.fn();
const loaderCallback = jest.fn();
const loaderInput = `
  fixtureModules: FIXTURE_MODULES,
  fixtureFiles: FIXTURE_FILES,
  deprecatedComponentModules: DEPRECATED_COMPONENT_MODULES,
  proxies: PROXIES`;

beforeEach(() => {
  mockAddContextDependency.mockClear();
  loaderCallback.mockClear();

  return new Promise(resolve => {
    const loaderContext = {
      async: () => (...args) => {
        loaderCallback(...args);
        resolve();
      },
      addContextDependency: mockAddContextDependency
    };
    embedModules.call(loaderContext, loaderInput);
  });
});

it('injects fixture modules', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, fixtureModules] = output.match(/fixtureModules: (.+)(,|$)/);

  const expected = `{
    '/components/__fixtures__/Foo/blank.js':require('/components/__fixtures__/Foo/blank.js'),
    '/components/__fixtures__/Bar/one.js':require('/components/__fixtures__/Bar/one.js'),
    '/components/__fixtures__/Bar/two.json':require('/components/__fixtures__/Bar/two.json')
  }`;
  expect(fixtureModules).toEqual(expected.replace(/\s/g, ''));
});

it('injects fixture files', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, fixtureFiles] = output.match(/fixtureFiles: (.+)(,|$)/);

  expect(JSON.parse(fixtureFiles)).toEqual([
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
  ]);
});

it('injects proxies', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, proxies] = output.match(/proxies: (.+)(,|$)/);

  expect(proxies).toEqual(
    `require('${require.resolve('../__fsmocks__/cosmos.proxies')}')`
  );
});

it('registers root path as loader context dep', () => {
  expect(mockAddContextDependency).toHaveBeenCalledWith('MOCK_ROOT_PATH');
});

it('injects deprecated components', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, deprecatedComponentModules] = output.match(
    /deprecatedComponentModules: (.+)(,|$)/
  );

  const expected = `{
    '/components/Foo.js':require('/components/Foo.js'),
    '/components/Bar.js':require('/components/Bar.js')
  }`;
  expect(deprecatedComponentModules).toEqual(expected.replace(/\s/g, ''));
});
