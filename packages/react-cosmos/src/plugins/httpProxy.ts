import { CosmosConfig } from '../config/shared';
import httpProxyMiddleware from 'http-proxy-middleware';
import { DevServerPluginArgs } from '../shared/devServer';

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

export function httpProxy({ cosmosConfig, expressApp }: DevServerPluginArgs) {
  const httpProxyConfig = getHttpProxyCosmosConfig(cosmosConfig);
  Object.keys(httpProxyConfig).forEach(context => {
    const config = httpProxyConfig[context];
    if (typeof config === 'string') {
      expressApp.use(context, httpProxyMiddleware(context, { target: config }));
    } else if (typeof config === 'object') {
      expressApp.use(context, httpProxyMiddleware(context, config));
    }
  });
}

function getHttpProxyCosmosConfig(cosmosConfig: CosmosConfig) {
  return (cosmosConfig.httpProxy || {}) as HttpProxyConfig;
}
