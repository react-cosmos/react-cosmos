/* eslint-disable no-console */

import path from 'path';

jest.mock('express');
jest.mock('webpack');
jest.mock('webpack-dev-middleware');
jest.mock('webpack-hot-middleware');

const processCwdMock = path.join(__dirname, 'dummy-config');
let realProcessCwd;

const modulePathsMock = {
  components: '__MOCK_COMPONENTS__',
  fixtures: '__MOCK_FIXTURES__',
};
const buildModulePathsMock = jest.fn(() => modulePathsMock);

const componentPaths = ['src/components', 'src/containers'];

let express;
let webpack;
let webpackDevMiddleware;
let webpackHotMiddleware;

let expressInstanceMock;
let loaderWebpackCompilerMock;
let playgroundWebpackCompilerMock;
let loaderWebpackDevMiddlewareMock;
let playgroundWebpackDevMiddlewareMock;
let webpackHotMiddlewareMock;

const userWebpackConfigMock = {};
let getLoaderWebpackConfigMock;
let getPlaygroundWebpackConfigMock;
let loaderWebpackConfigMock;
let playgroundWebpackConfigMock;

const startServer = () => {
  // yargs.argv gets destructured as soon as the ./server module is required,
  // so we need to mock yargs first
  require('../server')();
};

let consoleLogOrig;

beforeAll(() => {
  consoleLogOrig = console.log;
  console.log = jest.fn();
});

afterAll(() => {
  console.log = consoleLogOrig;
});

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();

  realProcessCwd = process.cwd;
  process.cwd = jest.fn(() => processCwdMock);

  express = require('express');
  webpack = require('webpack');
  webpackDevMiddleware = require('webpack-dev-middleware');
  webpackHotMiddleware = require('webpack-hot-middleware');

  expressInstanceMock = {
    use: jest.fn(),
    listen: jest.fn(),
  };
  express.__setInstanceMock(expressInstanceMock);

  loaderWebpackCompilerMock = {};
  playgroundWebpackCompilerMock = {};
  webpack.__setCompilerMocks([
    loaderWebpackCompilerMock,
    playgroundWebpackCompilerMock,
  ]);

  loaderWebpackDevMiddlewareMock = {};
  playgroundWebpackDevMiddlewareMock = {};
  webpackDevMiddleware.__setMocks([
    loaderWebpackDevMiddlewareMock,
    playgroundWebpackDevMiddlewareMock,
  ]);

  webpackHotMiddlewareMock = {};
  webpackHotMiddleware.__setMock(webpackHotMiddlewareMock);

  loaderWebpackConfigMock = {};
  getLoaderWebpackConfigMock = jest.fn(() => loaderWebpackConfigMock);
  jest.mock('../loader/webpack-config', () => getLoaderWebpackConfigMock);

  playgroundWebpackConfigMock = {};
  getPlaygroundWebpackConfigMock = jest.fn(() => playgroundWebpackConfigMock);
  jest.mock('../playground/webpack-config', () => getPlaygroundWebpackConfigMock);

  jest.mock('../build-module-paths', () => buildModulePathsMock);
});

afterEach(() => {
  process.cwd = realProcessCwd;
});

const commonTests = () => {
  test('compiles loader webpack using extended config', () => {
    expect(webpack.mock.calls[0][0]).toBe(loaderWebpackConfigMock);
  });

  test('compiles playground webpack', () => {
    expect(webpack.mock.calls[1][0]).toBe(playgroundWebpackConfigMock);
  });

  test('creates express server', () => {
    expect(express).toHaveBeenCalled();
  });

  test('sends loader webpack compiler to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[0][0]).toBe(loaderWebpackCompilerMock);
  });

  test('sends loader publicPath to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[0][1].publicPath).toBe('/loader/');
  });

  test('adds loader dev middleware to express server', () => {
    expect(expressInstanceMock.use.mock.calls[0][0]).toBe(loaderWebpackDevMiddlewareMock);
  });

  test('sends playground webpack compiler to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[1][0]).toBe(playgroundWebpackCompilerMock);
  });

  test('sends playground publicPath to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[1][1].publicPath).toBe('/');
  });

  test('adds playground dev middleware to express server', () => {
    expect(expressInstanceMock.use.mock.calls[1][0]).toBe(playgroundWebpackDevMiddlewareMock);
  });
};

describe('default config', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      componentPaths,
    }));
    jest.mock('./dummy-config/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('builds module paths with resolved user component paths', () => {
    expect(buildModulePathsMock.mock.calls[0][0]).toEqual(
      componentPaths.map((relPath) =>
        path.join(path.dirname(require.resolve('./dummy-config/cosmos.config')), relPath)
      )
    );
  });

  test('sends module paths to loader webpack config', () => {
    expect(getLoaderWebpackConfigMock.mock.calls[0][0]).toBe(modulePathsMock);
  });

  test('uses user webpack config from cwd', () => {
    expect(getLoaderWebpackConfigMock.mock.calls[0][1]).toBe(userWebpackConfigMock);
  });

  test('users cosmos config from cwd', () => {
    expect(getLoaderWebpackConfigMock.mock.calls[0][2]).toBe(
      path.join(processCwdMock, 'cosmos.config'));
  });

  test('does not use hot middleware', () => {
    expect(webpackHotMiddleware).not.toHaveBeenCalled();
  });

  test('does not create static server', () => {
    expect(express.static).not.toHaveBeenCalled();
  });

  test('starts express server with default hostname & port', () => {
    const [port, hostname] = expressInstanceMock.listen.mock.calls[0];
    expect(port).toBe(8989);
    expect(hostname).toBe('localhost');
  });
});

describe('with hot module replacement', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      hot: true,
    }));
    jest.mock('./dummy-config/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('sends loader webpack compiler to hot middleware', () => {
    expect(webpackHotMiddleware.mock.calls[0][0]).toBe(loaderWebpackCompilerMock);
  });

  test('adds hot middleware to express server', () => {
    expect(expressInstanceMock.use.mock.calls[2][0]).toBe(webpackHotMiddlewareMock);
  });
});

describe('with custom cosmos config path', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({
      argv: {
        config: 'custom-path/cosmos.config',
      },
    }));

    jest.mock('./dummy-config/custom-path/cosmos.config', () => ({
      componentPaths,
    }));
    jest.mock('./dummy-config/custom-path/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('builds module paths with resolved user component paths', () => {
    expect(buildModulePathsMock.mock.calls[0][0]).toEqual(
      componentPaths.map((relPath) => path.join(
        path.dirname(require.resolve('./dummy-config/custom-path/cosmos.config')), relPath)
      )
    );
  });

  test('uses user webpack config from cwd', () => {
    expect(getLoaderWebpackConfigMock.mock.calls[0][1]).toBe(userWebpackConfigMock);
  });

  test('uses cosmos config from custom path', () => {
    expect(getLoaderWebpackConfigMock.mock.calls[0][2]).toBe(
      path.join(processCwdMock, 'custom-path/cosmos.config'));
  });
});

describe('with custom webpack config path', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      webpackConfig: 'custom-path/webpack.config',
    }));
    jest.mock('./dummy-config/custom-path/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('uses user webpack config from custom path', () => {
    expect(getLoaderWebpackConfigMock.mock.calls[0][1]).toBe(userWebpackConfigMock);
  });

  test('uses cosmos config from custom path', () => {
    expect(getLoaderWebpackConfigMock.mock.calls[0][2]).toBe(
      path.join(processCwdMock, 'cosmos.config'));
  });
});

describe('with relative public path', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      publicPath: 'server/public',
    }));
    jest.mock('./dummy-config/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('creates static server with resolved public path', () => {
    expect(express.static.mock.calls[0][0]).toBe(path.join(processCwdMock, 'server/public'));
  });
});

describe('with absolute public path', () => {
  let publicPath;

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    publicPath = path.join(processCwdMock, 'server/public');
    jest.mock('./dummy-config/cosmos.config', () => ({
      publicPath,
    }));
    jest.mock('./dummy-config/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('creates static server with raw public path', () => {
    expect(express.static.mock.calls[0][0]).toBe(publicPath);
  });
});

describe('with relative devServer.contentBase in webpack config', () => {
  let contentBase;

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    contentBase = 'server/public';
    jest.mock('./dummy-config/cosmos.config', () => ({}));
    jest.mock('./dummy-config/webpack.config', () => ({
      devServer: {
        contentBase,
      },
    }));

    startServer();
  });

  commonTests();

  test('creates static server using content base', () => {
    expect(express.static.mock.calls[0][0]).toBe(path.join(processCwdMock, contentBase));
  });
});

describe('with absolute devServer.contentBase in webpack config', () => {
  let contentBase;

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    contentBase = path.join(processCwdMock, 'server/public');
    jest.mock('./dummy-config/cosmos.config', () => ({}));
    jest.mock('./dummy-config/webpack.config', () => ({
      devServer: {
        contentBase,
      },
    }));

    startServer();
  });

  commonTests();

  test('creates static server using content base', () => {
    expect(express.static.mock.calls[0][0]).toBe(contentBase);
  });
});

describe('with devServer.contentBase in webpack config and publicPath', () => {
  let publicPath;
  let contentBase;

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    publicPath = path.join(processCwdMock, 'server/public1');
    contentBase = path.join(processCwdMock, 'server/public2');
    jest.mock('./dummy-config/cosmos.config', () => ({
      publicPath,
    }));
    jest.mock('./dummy-config/webpack.config', () => ({
      devServer: {
        contentBase,
      },
    }));

    startServer();
  });

  commonTests();

  test('creates static server using public path', () => {
    expect(express.static.mock.calls[0][0]).toBe(publicPath);
  });
});

describe('with custom hostname and port', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      hostname: '192.168.1.2',
      port: 9999,
    }));
    jest.mock('./dummy-config/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('starts express server with default hostname & port', () => {
    const [port, hostname] = expressInstanceMock.listen.mock.calls[0];
    expect(port).toBe(9999);
    expect(hostname).toBe('192.168.1.2');
  });
});
