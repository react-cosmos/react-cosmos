// @flow

import httpProxyMiddleware from 'http-proxy-middleware';
import type { HttpProxyConfig } from 'react-cosmos-flow/config';

export function setupHttpProxy(
  app: express$Application,
  httpProxy: HttpProxyConfig
) {
  const { context, ...options } = httpProxy;
  if (typeof context === 'string') {
    app.use(context, httpProxyMiddleware(options));
  } else {
    Object.keys(httpProxy).forEach(contextKey => {
      const options = httpProxy[contextKey];
      app.use(contextKey, httpProxyMiddleware(options));
    });
  }
}
