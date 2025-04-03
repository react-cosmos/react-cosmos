import { createProxyMiddleware } from 'http-proxy-middleware';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';

type HttpProxyConfig = {
  [context: string]:
    | string
    | {
        target: string;
        secure?: boolean;
        pathRewrite?: { [rewrite: string]: string };
        logLevel?: 'error' | 'debug' | 'info' | 'warn' | 'silent';
      };
};

export const httpProxyPlugin: CosmosServerPlugin = {
  name: 'httpProxy',

  devServer({ config, platform, app }) {
    if (platform !== 'web') return;

    const httpProxyConfig = getHttpProxyCosmosConfig(config);
    Object.keys(httpProxyConfig).forEach(context => {
      const value = httpProxyConfig[context];
      if (typeof value === 'string') {
        app.use(context, createProxyMiddleware(context, { target: value }));
      } else if (typeof value === 'object') {
        app.use(context, createProxyMiddleware(context, value));
      }
    });
  },
};

function getHttpProxyCosmosConfig(config: CosmosConfig) {
  return (config.httpProxy || {}) as HttpProxyConfig;
}
