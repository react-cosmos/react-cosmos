import { createProxyMiddleware } from 'http-proxy-middleware';
import { CosmosConfig } from '../../cosmosConfig/types.js';
import { DevServerPluginArgs } from '../../cosmosPlugin/types.js';

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

export function httpProxyDevServerPlugin({
  platformType,
  cosmosConfig,
  expressApp,
}: DevServerPluginArgs) {
  if (platformType !== 'web') return;

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
