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
    let proxy = {};
    if (typeof httpProxyConfig[context] === 'string') {
      proxy = { target: httpProxyConfig[context] };
    } else if (typeof httpProxyConfig[context] === 'object') {
      proxy = httpProxyConfig[context];
    }
    expressApp.use(context, httpProxyMiddleware(proxy));
  });
}

function getHttpProxyCosmosConfig(cosmosConfig: CosmosConfig) {
  return (cosmosConfig.httpProxy || {}) as HttpProxyConfig;
}
