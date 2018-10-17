import httpProxyMiddleware from 'http-proxy-middleware';

import { setupHttpProxy } from '../http-proxy';

jest.mock('http-proxy-middleware');

describe('setup http proxy', () => {
  beforeEach(() => {
    httpProxyMiddleware.mockReset();
  });

  it('with basic configuration', () => {
    const app = {
      use: jest.fn()
    };

    const httpProxyConfig = {
      context: '/api',
      target: 'https://example.com',
      otherValue: {
        test: 'value'
      }
    };

    httpProxyMiddleware.mockReturnValueOnce('__MOCKED_MIDDLEWARE__');

    setupHttpProxy(app, httpProxyConfig);

    expect(app.use).toHaveBeenCalledWith('/api', '__MOCKED_MIDDLEWARE__');
    expect(httpProxyMiddleware).toHaveBeenCalledWith({
      target: 'https://example.com',
      otherValue: {
        test: 'value'
      }
    });
  });

  it('with advanced configuration', () => {
    const app = {
      use: jest.fn()
    };

    const httpProxyConfig = {
      '/api': {
        target: 'https://example-api.com',
        apiStuff: {
          api: 'value'
        }
      },
      '/assets': {
        target: 'https://example-assets.com',
        assetsStuff: {
          asset: 'value'
        }
      }
    };

    httpProxyMiddleware.mockReturnValueOnce('__MOCKED_API_MIDDLEWARE__');
    httpProxyMiddleware.mockReturnValueOnce('__MOCKED_ASSETS_MIDDLEWARE__');

    setupHttpProxy(app, httpProxyConfig);

    expect(app.use).toHaveBeenCalledWith('/api', '__MOCKED_API_MIDDLEWARE__');
    expect(httpProxyMiddleware).toHaveBeenCalledWith({
      target: 'https://example-api.com',
      apiStuff: {
        api: 'value'
      }
    });

    expect(app.use).toHaveBeenCalledWith(
      '/assets',
      '__MOCKED_ASSETS_MIDDLEWARE__'
    );
    expect(httpProxyMiddleware).toHaveBeenCalledWith({
      target: 'https://example-assets.com',
      assetsStuff: {
        asset: 'value'
      }
    });
  });
});
