const cosmosConfigRelPath = './dummy-config/cosmos.config';
const cosmosConfigPath = require.resolve(cosmosConfigRelPath);

const mockComponentPaths = [];
const mockFixturePaths = [];
jest.mock(cosmosConfigRelPath, () => ({
  componentPaths: mockComponentPaths,
  fixturePaths: mockFixturePaths,
}));

const mockGetFilePaths = jest.fn(() => ({
  components: {
    Foo: 'components/Foo.js',
    Bar: 'components/Bar.js',
  },
  fixtures: {
    Foo: {
      blank: 'components/__fixtures__/Foo/blank.js',
    },
    Bar: {
      one: 'components/__fixtures__/Bar/one.js',
      two: 'components/__fixtures__/Bar/two.json',
    },
  },
}));
jest.mock('react-cosmos-voyager', () => mockGetFilePaths);

const jsonLoader = require.resolve('json-loader');
const moduleLoader = require('../module-loader');

const mockAddDependency = jest.fn();
const loaderContext = {
  query: {
    cosmosConfigPath,
  },
  addDependency: mockAddDependency,
};
const loaderInput = 'components = COMPONENTS; fixtures = FIXTURES; contexts = CONTEXTS;';
const loaderOutput = moduleLoader.call(loaderContext, loaderInput);

// Replace actual request calls with a mock of their signature
// eslint-disable-next-line no-unused-vars
const __req = path => `__req(${path})`;

const [, componentsOutput, fixturesOutput, contextsOutput] =
  loaderOutput.match(/^components = (.+); fixtures = (.+); contexts = (.+);$/);

test('calls react-cosmos-voyager with component paths', () => {
  expect(mockGetFilePaths.mock.calls[0][0].componentPaths).toEqual(mockComponentPaths);
});

test('calls react-cosmos-voyager with fixture paths', () => {
  expect(mockGetFilePaths.mock.calls[0][0].fixturePaths).toEqual(mockFixturePaths);
});

test('injects components', () => {
  // eslint-disable-next-line no-eval
  const components = eval(`(${componentsOutput.replace(/require/g, '__req')})`);

  expect(components).toEqual({
    Foo: '__req(components/Foo.js)',
    Bar: '__req(components/Bar.js)',
  });
});

test('injects fixtures', () => {
  // eslint-disable-next-line no-eval
  const components = eval(`(${fixturesOutput.replace(/require/g, '__req')})`);

  expect(components).toEqual({
    Foo: {
      blank: '__req(components/__fixtures__/Foo/blank.js)',
    },
    Bar: {
      one: '__req(components/__fixtures__/Bar/one.js)',
      two: `__req(${jsonLoader}!components/__fixtures__/Bar/two.json)`,
    },
  });
});

test('injects contexts', () => {
  // eslint-disable-next-line no-eval
  const contexts = eval(`(${contextsOutput.replace(/require.context/g, '__req')})`);

  expect(contexts).toEqual([
    '__req(components)',
    '__req(components/__fixtures__/Foo)',
    '__req(components/__fixtures__/Bar)',
  ]);
});

test('registers user dirs as loader deps', () => {
  expect(mockAddDependency.mock.calls[0][0]).toEqual('components');
  expect(mockAddDependency.mock.calls[1][0]).toEqual('components/__fixtures__/Foo');
  expect(mockAddDependency.mock.calls[2][0]).toEqual('components/__fixtures__/Bar');
});
