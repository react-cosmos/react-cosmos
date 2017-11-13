import startServer from '../../server';
import httpProxyMiddleware from 'http-proxy-middleware';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9999,
    hostname: '127.0.0.1',
    httpProxy: { context: '/api', target: 'http://127.0.0.1:4000/api' },
    globalImports: [],
    componentPaths: []
  })
}));

const getCbs = {};
const mockGet = jest.fn((path, cb) => {
  getCbs[path] = cb;
});
const mockUse = jest.fn();
const mockListen = jest.fn();

jest.mock('express', () => {
  const mockExpress = jest.fn(() => ({
    get: mockGet,
    use: mockUse,
    listen: mockListen
  }));
  mockExpress.static = jest.fn();
  return mockExpress;
});

jest.mock('webpack', () => jest.fn(() => 'MOCK_WEBPACK_COMPILER'));

jest.mock('webpack-dev-middleware', () => jest.fn(() => 'MOCK_DEV_MIDDLEWARE'));
jest.mock('webpack-hot-middleware', () => jest.fn(() => 'MOCK_HOT_MIDDLEWARE'));

jest.mock('http-proxy-middleware', () =>
  jest.fn(() => 'MOCK_HTTP_PROXY_MIDDLEWARE')
);

jest.mock('../../extend-webpack-config', () =>
  jest.fn(() => 'MOCK_WEBPACK_CONFIG')
);

beforeEach(() => {
  jest.clearAllMocks();
  startServer();
});

it('sends httpProxy context urls to http-proxy-middleware', () => {
  expect(mockUse.mock.calls[0][0]).toBe('/api');
  expect(mockUse.mock.calls[0][1]).toBe('MOCK_HTTP_PROXY_MIDDLEWARE');
  expect(httpProxyMiddleware.mock.calls[0][0]).toBe(
    'http://127.0.0.1:4000/api'
  );
});
