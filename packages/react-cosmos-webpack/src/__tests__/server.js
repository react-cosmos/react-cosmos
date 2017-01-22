/* eslint-disable no-console */

import path from 'path';

jest.mock('express');
jest.mock('webpack');
jest.mock('webpack-dev-middleware');
jest.mock('webpack-hot-middleware');

const mockProcessCwd = path.join(__dirname, 'dummy-config');
let realProcessCwd;

const mockComponentPaths = ['src/components', 'src/containers'];

let express;
let webpack;
let webpackDevMiddleware;
let webpackHotMiddleware;

const expressInstanceCbMocks = {};
let mockExpressInstance;
let mockWebpackCompiler;
let mockWebpackDevMiddleware;
let mockWebpackHotMiddleware;

const mockUserWebpackConfig = {};
let mockGetWebpackConfig;
let mockWebpackConfig;

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
  jest.resetAllMocks();

  realProcessCwd = process.cwd;
  process.cwd = jest.fn(() => mockProcessCwd);

  express = require('express');
  webpack = require('webpack');
  webpackDevMiddleware = require('webpack-dev-middleware');
  webpackHotMiddleware = require('webpack-hot-middleware');

  mockExpressInstance = {
    use: jest.fn(),
    get: (route, cb) => { expressInstanceCbMocks[route] = cb; },
    listen: jest.fn(),
  };
  express.__setInstanceMock(mockExpressInstance);

  mockWebpackCompiler = {};
  webpack.__setCompilerMocks([
    mockWebpackCompiler,
  ]);

  mockWebpackDevMiddleware = {};
  webpackDevMiddleware.__setMocks([
    mockWebpackDevMiddleware,
  ]);

  mockWebpackHotMiddleware = {};
  webpackHotMiddleware.__setMock(mockWebpackHotMiddleware);

  mockWebpackConfig = {};
  mockGetWebpackConfig = jest.fn(() => mockWebpackConfig);
  jest.mock('../webpack-config', () => mockGetWebpackConfig);
});

afterEach(() => {
  process.cwd = realProcessCwd;
});

const commonTests = () => {
  test('compiles webpack using extended config', () => {
    expect(webpack.mock.calls[0][0]).toBe(mockWebpackConfig);
  });

  test('creates express server', () => {
    expect(express).toHaveBeenCalled();
  });

  test('sends webpack compiler to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[0][0]).toBe(mockWebpackCompiler);
  });

  test('sends publicPath to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[0][1].publicPath).toBe('/loader/');
  });

  test('adds dev middleware to express server', () => {
    expect(mockExpressInstance.use.mock.calls[0][0]).toBe(mockWebpackDevMiddleware);
  });

  test('serve index.html on / route', () => {
    const sendFile = jest.fn();
    expressInstanceCbMocks['/']({}, { sendFile });
    expect(sendFile.mock.calls[0][0]).toBe(require.resolve('../static/index.html'));
  });

  test('serve favicon.ico on /favicon.ico route', () => {
    const sendFile = jest.fn();
    expressInstanceCbMocks['/favicon.ico']({}, { sendFile });
    expect(sendFile.mock.calls[0][0]).toBe(require.resolve('../static/favicon.ico'));
  });
};

describe('default config', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      mockComponentPaths,
    }));
    jest.mock('./dummy-config/webpack.config', () => mockUserWebpackConfig);

    startServer();
  });

  commonTests();

  test('uses user webpack config from cwd', () => {
    expect(mockGetWebpackConfig.mock.calls[0][0]).toBe(mockUserWebpackConfig);
  });

  test('users cosmos config from cwd', () => {
    expect(mockGetWebpackConfig.mock.calls[0][1]).toBe(
      path.join(mockProcessCwd, 'cosmos.config'));
  });

  test('does not use hot middleware', () => {
    expect(webpackHotMiddleware).not.toHaveBeenCalled();
  });

  test('does not create static server', () => {
    expect(express.static).not.toHaveBeenCalled();
  });

  test('starts express server with default hostname & port', () => {
    const [port, hostname] = mockExpressInstance.listen.mock.calls[0];
    expect(port).toBe(8989);
    expect(hostname).toBe('localhost');
  });
});

describe('missing webpack config', () => {
  const mockDefaultWebpackConfig = {};

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      webpackConfigPath: 'missing-path/webpack.config',
    }));

    jest.mock('../default-webpack-config', () => () => mockDefaultWebpackConfig);

    startServer();
  });

  commonTests();

  test('uses default user webpack config', () => {
    expect(mockGetWebpackConfig.mock.calls[0][0]).toBe(mockDefaultWebpackConfig);
  });
});

describe('with hot module replacement', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      hot: true,
    }));
    jest.mock('./dummy-config/webpack.config', () => mockUserWebpackConfig);

    startServer();
  });

  commonTests();

  test('sends webpack compiler to hot middleware', () => {
    expect(webpackHotMiddleware.mock.calls[0][0]).toBe(mockWebpackCompiler);
  });

  test('adds hot middleware to express server', () => {
    expect(mockExpressInstance.use.mock.calls[1][0]).toBe(mockWebpackHotMiddleware);
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
      mockComponentPaths,
    }));
    jest.mock('./dummy-config/custom-path/webpack.config', () => mockUserWebpackConfig);

    startServer();
  });

  commonTests();

  test('uses user webpack config from cwd', () => {
    expect(mockGetWebpackConfig.mock.calls[0][0]).toBe(mockUserWebpackConfig);
  });

  test('uses cosmos config from custom path', () => {
    expect(mockGetWebpackConfig.mock.calls[0][1]).toBe(
      path.join(mockProcessCwd, 'custom-path/cosmos.config'));
  });
});

describe('with custom webpack config path', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      webpackConfig: 'custom-path/webpack.config',
    }));
    jest.mock('./dummy-config/custom-path/webpack.config', () => mockUserWebpackConfig);

    startServer();
  });

  commonTests();

  test('uses user webpack config from custom path', () => {
    expect(mockGetWebpackConfig.mock.calls[0][0]).toBe(mockUserWebpackConfig);
  });

  test('uses cosmos config from custom path', () => {
    expect(mockGetWebpackConfig.mock.calls[0][1]).toBe(
      path.join(mockProcessCwd, 'cosmos.config'));
  });
});

describe('with relative public path', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      publicPath: 'server/public',
    }));
    jest.mock('./dummy-config/webpack.config', () => mockUserWebpackConfig);

    startServer();
  });

  commonTests();

  test('creates static server with resolved public path', () => {
    expect(express.static.mock.calls[0][0]).toBe(path.join(mockProcessCwd, 'server/public'));
  });
});

describe('with absolute public path', () => {
  let mockPublicPath;

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    mockPublicPath = path.join(mockProcessCwd, 'server/public');
    jest.mock('./dummy-config/cosmos.config', () => ({
      publicPath: mockPublicPath,
    }));
    jest.mock('./dummy-config/webpack.config', () => mockUserWebpackConfig);

    startServer();
  });

  commonTests();

  test('creates static server with raw public path', () => {
    expect(express.static.mock.calls[0][0]).toBe(mockPublicPath);
  });
});

describe('with relative devServer.contentBase in webpack config', () => {
  let mockContentBase;

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    mockContentBase = 'server/public';
    jest.mock('./dummy-config/cosmos.config', () => ({}));
    jest.mock('./dummy-config/webpack.config', () => ({
      devServer: {
        contentBase: mockContentBase,
      },
    }));

    startServer();
  });

  commonTests();

  test('creates static server using content base', () => {
    expect(express.static.mock.calls[0][0]).toBe(path.join(mockProcessCwd, mockContentBase));
  });
});

describe('with absolute devServer.contentBase in webpack config', () => {
  let mockContentBase;

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    mockContentBase = path.join(mockProcessCwd, 'server/public');
    jest.mock('./dummy-config/cosmos.config', () => ({}));
    jest.mock('./dummy-config/webpack.config', () => ({
      devServer: {
        contentBase: mockContentBase,
      },
    }));

    startServer();
  });

  commonTests();

  test('creates static server using content base', () => {
    expect(express.static.mock.calls[0][0]).toBe(mockContentBase);
  });
});

describe('with devServer.contentBase in webpack config and publicPath', () => {
  let mockPublicPath;
  let mockContentBase;

  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    mockPublicPath = path.join(mockProcessCwd, 'server/public1');
    mockContentBase = path.join(mockProcessCwd, 'server/public2');
    jest.mock('./dummy-config/cosmos.config', () => ({
      publicPath: mockPublicPath,
    }));
    jest.mock('./dummy-config/webpack.config', () => ({
      devServer: {
        contentBase: mockContentBase,
      },
    }));

    startServer();
  });

  commonTests();

  test('creates static server using public path', () => {
    expect(express.static.mock.calls[0][0]).toBe(mockPublicPath);
  });
});

describe('with custom hostname and port', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({
      hostname: '192.168.1.2',
      port: 9999,
    }));
    jest.mock('./dummy-config/webpack.config', () => mockUserWebpackConfig);

    startServer();
  });

  commonTests();

  test('starts express server with default hostname & port', () => {
    const [port, hostname] = mockExpressInstance.listen.mock.calls[0];
    expect(port).toBe(9999);
    expect(hostname).toBe('192.168.1.2');
  });
});
