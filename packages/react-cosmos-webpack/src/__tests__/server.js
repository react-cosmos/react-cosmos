import path from 'path';

jest.mock('express');
jest.mock('webpack');
jest.mock('webpack-dev-middleware');
jest.mock('webpack-hot-middleware');

const processCwdMock = path.join(__dirname, 'dummy-config');
let realProcessCwd;

let express;
let webpack;
let webpackDevMiddleware;
let webpackHotMiddleware;

let expressInstanceMock;
let webpackCompilerMock;
let webpackDevMiddlewareMock;
let webpackHotMiddlewareMock;

const userWebpackConfigMock = {};
let getWebpackConfigMock;
let cosmosWebpackConfigMock;

const startServer = () => {
  // yargs.argv gets destructured as soon as the ./server module is required,
  // so we need to mock yargs first
  require('../server')();
};

beforeEach(() => {
  jest.resetModules();

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

  webpackCompilerMock = {};
  webpack.__setCompilerMock(webpackCompilerMock);

  webpackDevMiddlewareMock = {};
  webpackDevMiddleware.__setMock(webpackDevMiddlewareMock);

  webpackHotMiddlewareMock = {};
  webpackHotMiddleware.__setMock(webpackHotMiddlewareMock);

  cosmosWebpackConfigMock = {};
  getWebpackConfigMock = jest.fn(() => cosmosWebpackConfigMock);
  jest.mock('../webpack-config', () => getWebpackConfigMock);
});

afterEach(() => {
  process.cwd = realProcessCwd;
});

const commonTests = () => {
  test('compiles webpack using combined config', () => {
    expect(webpack.mock.calls[0][0]).toBe(cosmosWebpackConfigMock);
  });

  test('creates express server', () => {
    expect(express).toHaveBeenCalled();
  });

  test('sends webpack compiler to dev middleware', () => {
    expect(webpackDevMiddleware.mock.calls[0][0]).toBe(webpackCompilerMock);
  });

  test('adds dev middleware to express server', () => {
    expect(expressInstanceMock.use.mock.calls[0][0]).toBe(webpackDevMiddlewareMock);
  });
};

describe('default config', () => {
  beforeEach(() => {
    jest.mock('yargs', () => ({ argv: {} }));

    jest.mock('./dummy-config/cosmos.config', () => ({}));
    jest.mock('./dummy-config/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('reads webpack config from cwd', () => {
    expect(getWebpackConfigMock.mock.calls[0][0]).toBe(userWebpackConfigMock);
  });

  test('reads cosmos config from cwd', () => {
    expect(getWebpackConfigMock.mock.calls[0][1]).toBe(path.join(processCwdMock, 'cosmos.config'));
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

    jest.mock('./dummy-config/custom-path/cosmos.config', () => ({}));
    jest.mock('./dummy-config/custom-path/webpack.config', () => userWebpackConfigMock);

    startServer();
  });

  commonTests();

  test('reads webpack config from cwd', () => {
    expect(getWebpackConfigMock.mock.calls[0][0]).toBe(userWebpackConfigMock);
  });

  test('reads cosmos config from cwd', () => {
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

  test('reads webpack config from cwd', () => {
    expect(getWebpackConfigMock.mock.calls[0][0]).toBe(userWebpackConfigMock);
  });

  test('reads cosmos config from cwd', () => {
    expect(getWebpackConfigMock.mock.calls[0][1]).toBe(path.join(processCwdMock, 'cosmos.config'));
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

  test('creates static server', () => {
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

  test('creates static server', () => {
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
