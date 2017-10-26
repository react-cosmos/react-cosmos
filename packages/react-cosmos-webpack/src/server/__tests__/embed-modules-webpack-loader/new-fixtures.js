import { findFixtureFiles } from 'react-cosmos-voyager2/lib/server';

// Requiring because embed-modules-webpack-loader is a CJS module
const embedModules = require('../../embed-modules-webpack-loader');

// The values of these mocks doesn't matter, we check for identity
const mockFileMatch = [];
const mockExclude = [];

jest.mock('react-cosmos-config', () => () => ({
  rootPath: 'MOCK_ROOT_PATH',
  fileMatch: mockFileMatch,
  exclude: mockExclude,
  componentPaths: [],
  proxiesPath: require.resolve('../__fsmocks__/cosmos.proxies')
}));

const mockFixtureFiles = [
  {
    filePath: 'components/__fixtures__/Foo/blank.js',
    components: [
      {
        filePath: 'components/Foo.js',
        name: 'Foo'
      }
    ]
  },
  {
    filePath: 'components/__fixtures__/Bar/one.js',
    components: [
      {
        filePath: 'components/Bar.js',
        name: 'Bar'
      }
    ]
  },
  {
    filePath: 'components/__fixtures__/Bar/two.json',
    components: [
      {
        filePath: 'components/Bar.js',
        name: 'Bar'
      }
    ]
  }
];

jest.mock('react-cosmos-voyager2/lib/server/find-fixture-files', () => ({
  findFixtureFiles: jest.fn(() => mockFixtureFiles)
}));

const mockAddDependency = jest.fn();
const loaderCallback = jest.fn();
const loaderInput = `
  fixtureModules: FIXTURE_MODULES,
  fixtureFiles: FIXTURE_FILES,
  deprecatedComponentModules: DEPRECATED_COMPONENT_MODULES,
  proxies: PROXIES,
  contexts: CONTEXTS`;

beforeEach(() => {
  mockAddDependency.mockClear();
  loaderCallback.mockClear();

  return new Promise(resolve => {
    const loaderContext = {
      async: () => (...args) => {
        loaderCallback(...args);
        resolve();
      },
      addDependency: mockAddDependency
    };
    embedModules.call(loaderContext, loaderInput);
  });
});

it('calls findFixtureFiles with fileMatch with rootPath as cwd', () => {
  expect(findFixtureFiles.mock.calls[0][0].cwd).toBe('MOCK_ROOT_PATH');
});

it('calls findFixtureFiles with fileMatch config', () => {
  expect(findFixtureFiles.mock.calls[0][0].fileMatch).toBe(mockFileMatch);
});

it('calls findFixtureFiles with exclude config', () => {
  expect(findFixtureFiles.mock.calls[0][0].exclude).toBe(mockExclude);
});

it('injects fixture modules', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, fixtureModules] = output.match(/fixtureModules: (.+)(,|$)/);

  const expected = `{
    'components/__fixtures__/Foo/blank.js':require('components/__fixtures__/Foo/blank.js'),
    'components/__fixtures__/Bar/one.js':require('components/__fixtures__/Bar/one.js'),
    'components/__fixtures__/Bar/two.json':require('components/__fixtures__/Bar/two.json')
  }`;
  expect(fixtureModules).toEqual(expected.replace(/\s/g, ''));
});

it('injects fixture files', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, fixtureFiles] = output.match(/fixtureFiles: (.+)(,|$)/);

  expect(JSON.parse(fixtureFiles)).toEqual(mockFixtureFiles);
});

it('injects proxies', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, proxies] = output.match(/proxies: (.+)(,|$)/);

  expect(proxies).toEqual(
    `require('${require.resolve('../__fsmocks__/cosmos.proxies')}')`
  );
});

it('injects contexts', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, contexts] = output.match(/contexts: (.+)(,|$)/);

  const expected = `[
    require.context('components/__fixtures__/Foo',false,/\\.jsx?$/),
    require.context('components/__fixtures__/Bar',false,/\\.jsx?$/)
  ]`;
  expect(contexts).toEqual(expected.replace(/\s/g, ''));
});

it('registers user dirs as loader deps', () => {
  expect(mockAddDependency).toHaveBeenCalledWith('components/__fixtures__/Foo');
  expect(mockAddDependency).toHaveBeenCalledWith('components/__fixtures__/Bar');
});

it('injects empty deprecated components', () => {
  const output = loaderCallback.mock.calls[0][1];
  const [, deprecatedComponentModules] = output.match(
    /deprecatedComponentModules: (.+)(,|$)/
  );

  expect(deprecatedComponentModules).toEqual('{}');
});
