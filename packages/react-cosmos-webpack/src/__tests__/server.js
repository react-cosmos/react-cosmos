/* eslint-disable no-console */

import path from 'path';

jest.mock('express');
jest.mock('webpack');
jest.mock('webpack-dev-middleware');
jest.mock('webpack-hot-middleware');

const processCwdMock = path.join(__dirname, 'dummy-config');
let realProcessCwd;

const componentPaths = ['src/components', 'src/containers'];

let express;
let webpack;
let webpackDevMiddleware;
let webpackHotMiddleware;

const expressInstanceCbMocks = {};
let expressInstanceMock;
let webpackCompilerMock;
let webpackDevMiddlewareMock;
let webpackHotMiddlewareMock;

const userWebpackConfigMock = {};
let getWebpackConfigMock;
let webpackConfigMock;

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
    get: (route, cb) => { expressInstanceCbMocks[route] = cb; },
    listen: jest.fn(),
  };
  express.__setInstanceMock(expressInstanceMock);

  webpackCompilerMock = {};
  webpack.__setCompilerMocks([
    webpackCompilerMock,
  ]);

  webpackDevMiddlewareMock = {};
  webpackDevMiddleware.__setMocks([
    webpackDevMiddlewareMock,
  ]);

  webpackHotMiddlewareMock = {};
  webpackHotMiddleware.__setMock(webpackHotMiddlewareMock);

  webpackConfigMock = {};
  getWebpackConfigMock = jest.fn(() => webpackConfigMock);
  jest.mock('../webpack-config', () => getWebpackConfigMock);
});

afterEach(() => {
  process.cwd = realProcessCwd;
});

const commonTests = () => {
  test('compiles webpack using extended config', () => {
    expect(webpack.mock.calls[0][0]).toBe(webpackConfigMock);
  });

  test('creates express server', () => {
    expect(express).toHaveBeenCalled();
  });

  test('sends webpack compiler to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[0][0]).toBe(webpackCompilerMock);
  });

  test('sends publicPath to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[0][1].publicPath).toBe('/loader/');
  });

  test('adds dev middleware to express server', () => {
    expect(expressInstanceMock.use.mock.calls[0][0]).toBe(webpackDevMiddlewareMock);
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
      componentPaths,
    }));
    jest.mock('./dummy-config/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('uses user webpack config from cwd', () => {
    expect(getWebpackConfigMock.mock.calls[0][0]).toBe(userWebpackConfigMock);
  });

  test('users cosmos config from cwd', () => {
    expect(getWebpackConfigMock.mock.calls[0][1]).toBe(
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

  test('sends webpack compiler to hot middleware', () => {
    expect(webpackHotMiddleware.mock.calls[0][0]).toBe(webpackCompilerMock);
  });

  test('adds hot middleware to express server', () => {
    expect(expressInstanceMock.use.mock.calls[1][0]).toBe(webpackHotMiddlewareMock);
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

  test('uses user webpack config from cwd', () => {
    expect(getWebpackConfigMock.mock.calls[0][0]).toBe(userWebpackConfigMock);
  });

  test('uses cosmos config from custom path', () => {
    expect(getWebpackConfigMock.mock.calls[0][1]).toBe(
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
    expect(getWebpackConfigMock.mock.calls[0][0]).toBe(userWebpackConfigMock);
  });

  test('uses cosmos config from custom path', () => {
    expect(getWebpackConfigMock.mock.calls[0][1]).toBe(
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
