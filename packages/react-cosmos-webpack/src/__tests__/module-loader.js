const cosmosConfigPath = '/mock/config/path';

const mockComponentPaths = [];
const mockFixturePaths = [];
const proxiesPath = require.resolve('./mocks/cosmos.proxies');

const mockGetCosmosConfig = jest.fn(() => ({
  componentPaths: mockComponentPaths,
  fixturePaths: mockFixturePaths,
  proxiesPath
}));

jest.mock('react-cosmos-config', () => mockGetCosmosConfig);

const mockGetFilePaths = jest.fn(() => ({
  components: {
    Foo: 'components/Foo.js',
    Bar: 'components/Bar.js'
  },
  fixtures: {
    Foo: {
      blank: 'components/__fixtures__/Foo/blank.js'
    },
    Bar: {
      one: 'components/__fixtures__/Bar/one.js',
      two: 'components/__fixtures__/Bar/two.json'
    }
  }
}));
jest.mock('react-cosmos-voyager', () => mockGetFilePaths);

const moduleLoader = require('../module-loader');

const mockAddDependency = jest.fn();
const loaderContext = {
  query: {
    cosmosConfigPath
  },
  addDependency: mockAddDependency
};
const loaderInput =
  'components = COMPONENTS; fixtures = FIXTURES; proxies = PROXIES; contexts = CONTEXTS;';
const loaderOutput = moduleLoader.call(loaderContext, loaderInput);

// Replace actual request calls with a mock of their signature
// eslint-disable-next-line no-unused-vars
const __req = (...args) => `__req(${[...args]})`;

const [
  ,
  componentsOutput,
  fixturesOutput,
  proxiesOutput,
  contextsOutput
] = loaderOutput.match(
  /^components = (.+); fixtures = (.+); proxies = (.+); contexts = (.+);$/
);

test('calls react-cosmos-config with cosmos config path', () => {
  expect(mockGetCosmosConfig.mock.calls[0][0]).toBe(cosmosConfigPath);
});

test('calls react-cosmos-voyager with component paths', () => {
  expect(mockGetFilePaths.mock.calls[0][0].componentPaths).toBe(
    mockComponentPaths
  );
});

test('calls react-cosmos-voyager with fixture paths', () => {
  expect(mockGetFilePaths.mock.calls[0][0].fixturePaths).toBe(mockFixturePaths);
});

test('injects components', () => {
  // eslint-disable-next-line no-eval
  const components = eval(`(${componentsOutput.replace(/require/g, '__req')})`);

  expect(components).toEqual({
    Foo: '__req(components/Foo.js)',
    Bar: '__req(components/Bar.js)'
  });
});

test('injects fixtures', () => {
  // eslint-disable-next-line no-eval
  const components = eval(`(${fixturesOutput.replace(/require/g, '__req')})`);

  expect(components).toEqual({
    Foo: {
      blank: '__req(components/__fixtures__/Foo/blank.js)'
    },
    Bar: {
      one: '__req(components/__fixtures__/Bar/one.js)',
      two: `__req(components/__fixtures__/Bar/two.json)`
    }
  });
});

test('injects proxies', () => {
  // eslint-disable-next-line no-eval
  const proxies = eval(`(${proxiesOutput.replace(/require/g, '__req')})`);

  expect(proxies).toEqual(`__req(${proxiesPath})`);
});

test('injects contexts', () => {
  // eslint-disable-next-line no-eval
  const contexts = eval(
    `(${contextsOutput.replace(/require.context/g, '__req')})`
  );

  expect(contexts).toEqual([
    '__req(components,false,/\\.jsx?$/)',
    '__req(components/__fixtures__/Foo,false,/\\.jsx?$/)',
    '__req(components/__fixtures__/Bar,false,/\\.jsx?$/)'
  ]);
});

test('registers user dirs as loader deps', () => {
  expect(mockAddDependency.mock.calls[0][0]).toEqual('components');
  expect(mockAddDependency.mock.calls[1][0]).toEqual(
    'components/__fixtures__/Foo'
  );
  expect(mockAddDependency.mock.calls[2][0]).toEqual(
    'components/__fixtures__/Bar'
  );
});
