import path from 'path';
import getCosmosConfig from '../index';

jest.unmock('resolve-from');

const cosmosConfigPath = require.resolve('./mocks/cosmos.config');

beforeEach(() => {
  jest.resetModules();
});

test('loads config options', () => {
  jest.mock('./mocks/cosmos.config', () => ({
    foo: 'bar'
  }));

  expect(getCosmosConfig(cosmosConfigPath).foo).toBe('bar');
});

describe('resolves module paths', () => {
  let globalImports;
  let proxiesPath;

  beforeEach(() => {
    jest.mock('./mocks/cosmos.config', () => ({
      // Existing modules chosen arbitrarily
      globalImports: ['react-cosmos-utils/src/import-module'],
      proxiesPath: 'react-cosmos-utils/src/linked-list'
    }));

    ({ globalImports, proxiesPath } = getCosmosConfig(cosmosConfigPath));
  });

  test('global imports', () => {
    expect(globalImports).toEqual([
      path.join(__dirname, '../../../react-cosmos-utils/src/import-module.js')
    ]);
  });

  test('proxies', () => {
    expect(proxiesPath).toEqual(
      path.join(__dirname, '../../../react-cosmos-utils/src/linked-list.js')
    );
  });
});

describe('keeps absolute paths', () => {
  let componentPaths;
  let fixturePaths;
  let globalImports;
  let proxiesPath;
  let publicPath;
  let webpackConfigPath;
  let outputPath;

  beforeEach(() => {
    jest.mock('./mocks/cosmos.config', () => ({
      componentPaths: ['/path/to/components'],
      fixturePaths: ['/path/to/fixtures'],
      globalImports: ['/path/to/import'],
      proxiesPath: '/path/to/proxy',
      publicPath: '/path/to/static',
      webpackConfigPath: '/path/to/webpack',
      outputPath: '/path/to/output'
    }));

    ({
      componentPaths,
      fixturePaths,
      globalImports,
      proxiesPath,
      publicPath,
      webpackConfigPath,
      outputPath
    } = getCosmosConfig(cosmosConfigPath));
  });

  test('components', () => {
    expect(componentPaths).toEqual(['/path/to/components']);
  });

  test('fixtures', () => {
    expect(fixturePaths).toEqual(['/path/to/fixtures']);
  });

  test('global imports', () => {
    expect(globalImports).toEqual(['/path/to/import']);
  });

  test('proxies', () => {
    expect(proxiesPath).toEqual('/path/to/proxy');
  });

  test('public', () => {
    expect(publicPath).toEqual('/path/to/static');
  });

  test('webpack config', () => {
    expect(webpackConfigPath).toEqual('/path/to/webpack');
  });

  test('output path', () => {
    expect(outputPath).toEqual('/path/to/output');
  });
});

describe('resolves relative paths', () => {
  let componentPaths;
  let fixturePaths;
  let globalImports;
  let proxiesPath;
  let publicPath;
  let webpackConfigPath;
  let outputPath;

  beforeEach(() => {
    jest.mock('./mocks/cosmos.config', () => ({
      componentPaths: ['./path/to/components'],
      fixturePaths: ['./path/to/fixtures'],
      globalImports: ['./path/to/import'],
      proxiesPath: './path/to/proxy',
      publicPath: './path/to/static',
      webpackConfigPath: './path/to/webpack',
      outputPath: './path/to/output'
    }));

    ({
      componentPaths,
      fixturePaths,
      globalImports,
      proxiesPath,
      publicPath,
      webpackConfigPath,
      outputPath
    } = getCosmosConfig(cosmosConfigPath));
  });

  test('components', () => {
    expect(componentPaths).toEqual([
      path.join(__dirname, 'mocks/path/to/components')
    ]);
  });

  test('fixtures', () => {
    expect(fixturePaths).toEqual([
      path.join(__dirname, 'mocks/path/to/fixtures')
    ]);
  });

  test('global imports', () => {
    expect(globalImports).toEqual([
      path.join(__dirname, 'mocks/path/to/import')
    ]);
  });

  test('proxies', () => {
    expect(proxiesPath).toEqual(path.join(__dirname, 'mocks/path/to/proxy'));
  });

  test('public', () => {
    expect(publicPath).toEqual(path.join(__dirname, 'mocks/path/to/static'));
  });

  test('webpack config', () => {
    expect(webpackConfigPath).toEqual(
      path.join(__dirname, 'mocks/path/to/webpack')
    );
  });

  test('output path', () => {
    expect(outputPath).toEqual(path.join(__dirname, 'mocks/path/to/output'));
  });
});

describe('defaults', () => {
  test('provide relative proxies path', () => {
    jest.mock('./mocks/cosmos.config', () => ({}));

    expect(getCosmosConfig(cosmosConfigPath).proxiesPath).toBe(
      path.join(__dirname, 'mocks/cosmos.proxies')
    );
  });

  test('provide relative webpack path', () => {
    jest.mock('./mocks/cosmos.config', () => ({}));

    expect(getCosmosConfig(cosmosConfigPath).webpackConfigPath).toBe(
      path.join(__dirname, 'mocks/webpack.config')
    );
  });

  test('provide hot reloading', () => {
    jest.mock('./mocks/cosmos.config', () => ({}));

    const { hot } = getCosmosConfig(cosmosConfigPath);
    expect(hot).toBe(true);
  });

  test('are extended', () => {
    jest.mock('./mocks/cosmos.config', () => ({ hot: false }));

    const { hot } = getCosmosConfig(cosmosConfigPath);
    expect(hot).toBe(false);
  });
});
