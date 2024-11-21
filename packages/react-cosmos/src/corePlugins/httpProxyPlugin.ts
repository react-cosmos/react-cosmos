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

  devServer({ cosmosConfig, platform, expressApp }) {
    if (platform !== 'web') return;

    const httpProxyConfig = getHttpProxyCosmosConfig(cosmosConfig);
    Object.keys(httpProxyConfig).forEach(context => {
      const config = httpProxyConfig[context];
      if (typeof config === 'string') {
        expressApp.use(
          context,
          createProxyMiddleware({ target: config, pathFilter: context })
        );
      } else if (typeof config === 'object') {
        expressApp.use(
          context,
          createProxyMiddleware({ ...config, pathFilter: context })
        );
      }
    });
  },
};

function getHttpProxyCosmosConfig(cosmosConfig: CosmosConfig) {
  return (cosmosConfig.httpProxy || {}) as HttpProxyConfig;
}
