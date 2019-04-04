import express from 'express';
import httpProxyMiddleware from 'http-proxy-middleware';

export type HttpProxyConfig = {
  [contextKey: string]:
    | string
    | string[]
    | httpProxyMiddleware.Filter
    | httpProxyMiddleware.Config;
};

export function setupHttpProxy(
  app: express.Application,
  httpProxy: HttpProxyConfig
) {
  Object.keys(httpProxy).forEach(contextKey => {
    const config = httpProxy[contextKey];
    // For whatever reason we just can't call httpProxyMiddleware(config) when
    // config matches parameters from multiple fn overload signatures
    const proxy =
      typeof config === 'string' ||
      typeof config === 'function' ||
      Array.isArray(config)
        ? httpProxyMiddleware(config)
        : httpProxyMiddleware(config);
    app.use(contextKey, proxy);
  });
}
