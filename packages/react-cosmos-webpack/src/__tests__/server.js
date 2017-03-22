import path from 'path';

jest.mock('express');
jest.mock('webpack');
jest.mock('webpack-dev-middleware');
jest.mock('webpack-hot-middleware');

const mockProcessCwd = path.join(__dirname, 'dummy-config');
let realProcessCwd;

let express;
let webpack;
let webpackDevMiddleware;
let webpackHotMiddleware;

const expressInstanceCbMocks = {};
let mockExpressInstance;
let mockWebpackCompiler;
let mockWebpackDevMiddleware;
let mockWebpackHotMiddleware;

let mockGetCosmosConfig;

let mockGetWebpackConfig;
let mockWebpackConfig;

const startServer = (argv, config) => {
  const mockYargs = { argv };
  jest.mock('yargs', () => mockYargs);

  const mockConfig = {
    port: 8989,
    hostname: 'localhost',
    webpackConfigPath: require.resolve('./mocks/webpack.config.js'),
    ...config,
  };
  mockGetCosmosConfig = jest.fn(() => mockConfig);
  jest.mock('react-cosmos-config', () => mockGetCosmosConfig);

  // \yargs.argv gets destructured as soon as the ./server module is required,
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
    get: (route, cb) => {
      expressInstanceCbMocks[route] = cb;
    },
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
    startServer({}, {});
  });

  commonTests();

  test('sends undefined config path to react-cosmos-config', () => {
    expect(mockGetCosmosConfig.mock.calls[0][0]).toBe(undefined);
  });

  test('sends user webpack config to getWebpackConfig', () => {
    expect(mockGetWebpackConfig.mock.calls[0][0]).toBe(require('./mocks/webpack.config').default);
  });

  test('sends undefined path to getWebpackConfig', () => {
    expect(mockGetWebpackConfig.mock.calls[0][1]).toBe(undefined);
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
    jest.mock('../default-webpack-config', () => () => mockDefaultWebpackConfig);

    startServer({}, {
      webpackConfigPath: path.join(__dirname, 'webpack.config-missing.js'),
    });
  });

  commonTests();

  test('uses default user webpack config', () => {
    expect(mockGetWebpackConfig.mock.calls[0][0]).toBe(mockDefaultWebpackConfig);
  });
});

describe('with hot module replacement', () => {
  beforeEach(() => {
    startServer({}, {
      hot: true,
    });
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
    startServer({
      config: 'custom-path/cosmos.config',
    }, {});
  });

  commonTests();

  test('sends custom config path to react-cosmos-config', () => {
    expect(mockGetCosmosConfig.mock.calls[0][0]).toBe('custom-path/cosmos.config');
  });

  test('sends custom config path to getWebpackConfig', () => {
    expect(mockGetWebpackConfig.mock.calls[0][1]).toBe('custom-path/cosmos.config');
  });
});

describe('with public path', () => {
  beforeEach(() => {
    startServer({}, {
      publicPath: 'server/public',
    });
  });

  commonTests();

  test('creates static server with public path', () => {
    expect(express.static.mock.calls[0][0]).toBe('server/public');
  });
});

describe('with devServer.contentBase in webpack config', () => {
  beforeEach(() => {
    startServer({}, {
      webpackConfigPath: require.resolve('./mocks/webpack.config-content-base.js'),
    });
  });

  commonTests();

  test('creates static server using content base', () => {
    expect(express.static.mock.calls[0][0]).toBe('user/server/public');
  });
});

describe('with devServer.contentBase in webpack config and publicPath', () => {
  beforeEach(() => {
    startServer({}, {
      publicPath: 'server/public',
      webpackConfigPath: require.resolve('./mocks/webpack.config-content-base.js'),
    });
  });

  commonTests();

  test('creates static server using public path', () => {
    expect(express.static.mock.calls[0][0]).toBe('server/public');
  });
});
