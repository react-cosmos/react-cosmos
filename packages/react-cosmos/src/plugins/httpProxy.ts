import { createProxyMiddleware } from 'http-proxy-middleware';
import { CosmosConfig } from '../config/shared';
import { DevServerPluginArgs } from '../devServer/startDevServer';

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
      expressApp.use(
        context,
        createProxyMiddleware(context, { target: config })
      );
    } else if (typeof config === 'object') {
      expressApp.use(context, createProxyMiddleware(context, config));
    }
  });
}

function getHttpProxyCosmosConfig(cosmosConfig: CosmosConfig) {
  return (cosmosConfig.httpProxy || {}) as HttpProxyConfig;
}
