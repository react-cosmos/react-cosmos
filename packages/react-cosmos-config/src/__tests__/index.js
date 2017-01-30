import path from 'path';
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

test('resolves module global imports', () => {
  mockUserConfig('./mock-cwd/cosmos.config', {
    // react-cosmos-utils/src/import-module chosen arbitrarily from project's deps
    globalImports: ['react-cosmos-utils/src/import-module']
  });

  expect(getCosmosConfig().globalImports).toEqual([path.join(__dirname, '../../../react-cosmos-utils/src/import-module.js')]);
});

describe('keeps absolute paths', () => {
  let componentPaths;
  let fixturePaths;
  let globalImports;
  let publicPath;
  let webpackConfigPath;

  beforeEach(() => {
    mockUserConfig('./mock-cwd/cosmos.config', {
      componentPaths: ['/path/to/components'],
      fixturePaths: ['/path/to/fixtures'],
      globalImports: ['/path/to/import'],
      publicPath: '/path/to/static',
      webpackConfigPath: '/path/to/webpack',
    });

    ({ componentPaths, fixturePaths, globalImports, publicPath, webpackConfigPath } =
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

  test('public', () => {
    expect(publicPath).toEqual('/path/to/static');
  });

  test('webpack config', () => {
    expect(webpackConfigPath).toEqual('/path/to/webpack');
  });
});

describe('resolves relative paths', () => {
  let componentPaths;
  let fixturePaths;
  let globalImports;
  let publicPath;
  let webpackConfigPath;

  beforeEach(() => {
    mockUserConfig('./mock-cwd/custom-path/cosmos.config', {
      componentPaths: ['./path/to/components'],
      fixturePaths: ['./path/to/fixtures'],
      globalImports: ['./path/to/import'],
      publicPath: './path/to/static',
      webpackConfigPath: './path/to/webpack',
    });

    ({ componentPaths, fixturePaths, globalImports, publicPath, webpackConfigPath } =
      getCosmosConfig('./custom-path/cosmos.config'));
  });

  test('components', () => {
    expect(componentPaths).toEqual([path.join(__dirname, 'mock-cwd/custom-path/path/to/components')]);
  });

  test('fixtures', () => {
    expect(fixturePaths).toEqual([path.join(__dirname, 'mock-cwd/custom-path/path/to/fixtures')]);
  });

  test('global imports', () => {
    expect(globalImports).toEqual([path.join(__dirname, 'mock-cwd/custom-path/path/to/import')]);
  });

  test('public', () => {
    expect(publicPath).toEqual(path.join(__dirname, 'mock-cwd/custom-path/path/to/static'));
  });

  test('webpack config', () => {
    expect(webpackConfigPath).toEqual(path.join(__dirname, 'mock-cwd/custom-path/path/to/webpack'));
  });
});

describe('defaults', () => {
  test('provide relative webpack path', () => {
    mockUserConfig('./mock-cwd/cosmos.config', {});

    expect(getCosmosConfig().webpackConfigPath).toBe(path.join(__dirname, 'mock-cwd/webpack.config'));
  });

  test('provide hot reloading', () => {
    mockUserConfig('./mock-cwd/cosmos.config', {});

    const { hot, hmrPlugin } = getCosmosConfig();
    expect(hot).toBe(true);
    expect(hmrPlugin).toBe(true);
  });

  test('are extended', () => {
    mockUserConfig('./mock-cwd/cosmos.config', { hmrPlugin: false });

    const { hot, hmrPlugin } = getCosmosConfig();
    expect(hot).toBe(true);
    expect(hmrPlugin).toBe(false);
  });
});
