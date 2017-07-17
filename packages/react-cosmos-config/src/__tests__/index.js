import path from 'path';
import slash from 'slash';
import getCosmosConfig from '../index';

const mockUserConfig = (path, mockConfig) => {
  jest.mock(path, () => mockConfig);
};

const mockProcessCwd = path.join(__dirname, 'mock-cwd');
let origProcessCwd;

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();

  origProcessCwd = process.cwd;
  process.cwd = jest.fn(() => mockProcessCwd);
});

afterEach(() => {
  process.cwd = origProcessCwd;
});

test('loads cosmos.config.js from cwd', () => {
  const opt = {};
  mockUserConfig('./mock-cwd/cosmos.config', { opt });

  expect(getCosmosConfig().opt).toBe(opt);
});

test('loads custom config path', () => {
  const opt = {};
  mockUserConfig('./mock-cwd/custom-path/cosmos.config', { opt });

  expect(getCosmosConfig('./custom-path/cosmos.config').opt).toBe(opt);
});

describe('resolves module paths', () => {
  let globalImports;
  let proxies;

  beforeEach(() => {
    mockUserConfig('./mock-cwd/cosmos.config', {
      // \react-cosmos-utils chosen arbitrarily from project's deps
      globalImports: ['react-cosmos-utils/src/import-module'],
      proxies: ['react-cosmos-utils/src/linked-list']
    });

    ({ globalImports, proxies } =
      getCosmosConfig());
  });

  test('global imports', () => {
    expect(globalImports).toEqual([slash(path.join(__dirname, '../../../react-cosmos-utils/src/import-module.js'))]);
  });

  test('proxies', () => {
    expect(proxies).toEqual([slash(path.join(__dirname, '../../../react-cosmos-utils/src/linked-list.js'))]);
  });
});

describe('keeps absolute paths', () => {
  let componentPaths;
  let fixturePaths;
  let globalImports;
  let proxies;
  let publicPath;
  let webpackConfigPath;
  let outputPath;

  beforeEach(() => {
    mockUserConfig('./mock-cwd/cosmos.config', {
      componentPaths: ['/path/to/components'],
      fixturePaths: ['/path/to/fixtures'],
      globalImports: ['/path/to/import'],
      proxies: ['/path/to/proxy'],
      publicPath: '/path/to/static',
      webpackConfigPath: '/path/to/webpack',
      outputPath: '/path/to/output',
    });

    ({ componentPaths, fixturePaths, globalImports, proxies, publicPath, webpackConfigPath, outputPath } =
      getCosmosConfig());
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
    expect(proxies).toEqual(['/path/to/proxy']);
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
  let proxies;
  let publicPath;
  let webpackConfigPath;
  let outputPath;

  beforeEach(() => {
    mockUserConfig('./mock-cwd/custom-path/cosmos.config', {
      componentPaths: ['./path/to/components'],
      fixturePaths: ['./path/to/fixtures'],
      globalImports: ['./path/to/import'],
      proxies: ['./path/to/proxy'],
      publicPath: './path/to/static',
      webpackConfigPath: './path/to/webpack',
      outputPath: './path/to/output',
    });

    ({ componentPaths, fixturePaths, globalImports, proxies, publicPath, webpackConfigPath, outputPath } =
      getCosmosConfig('./custom-path/cosmos.config'));
  });

  test('components', () => {
    expect(componentPaths).toEqual([slash(path.join(__dirname, 'mock-cwd/custom-path/path/to/components'))]);
  });

  test('fixtures', () => {
    expect(fixturePaths).toEqual([slash(path.join(__dirname, 'mock-cwd/custom-path/path/to/fixtures'))]);
  });

  test('global imports', () => {
    expect(globalImports).toEqual([slash(path.join(__dirname, 'mock-cwd/custom-path/path/to/import'))]);
  });

  test('proxies', () => {
    expect(proxies).toEqual([slash(path.join(__dirname, 'mock-cwd/custom-path/path/to/proxy'))]);
  });

  test('public', () => {
    expect(publicPath).toEqual(slash(path.join(__dirname, 'mock-cwd/custom-path/path/to/static')));
  });

  test('webpack config', () => {
    expect(webpackConfigPath).toEqual(slash(path.join(__dirname, 'mock-cwd/custom-path/path/to/webpack')));
  });

  test('output path', () => {
    expect(outputPath).toEqual(slash(path.join(__dirname, 'mock-cwd/custom-path/path/to/output')));
  });
});

describe('defaults', () => {
  test('provide relative webpack path', () => {
    mockUserConfig('./mock-cwd/cosmos.config', {});

    expect(getCosmosConfig().webpackConfigPath).toBe(slash(path.join(__dirname, 'mock-cwd/webpack.config')));
  });

  test('provide hot reloading', () => {
    mockUserConfig('./mock-cwd/cosmos.config', {});

    const { hot } = getCosmosConfig();
    expect(hot).toBe(true);
  });

  test('are extended', () => {
    mockUserConfig('./mock-cwd/cosmos.config', { hot: false });

    const { hot } = getCosmosConfig();
    expect(hot).toBe(false);
  });
});
