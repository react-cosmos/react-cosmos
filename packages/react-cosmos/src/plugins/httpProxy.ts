import { CosmosConfig } from '../config/shared';
import httpProxyMiddleware from 'http-proxy-middleware';
import { DevServerPluginArgs } from '../shared/devServer';

// TODO: Support advanced configuration
// See https://github.com/react-cosmos/react-cosmos/pull/875 for context
// Supporting all httpProxy options isn't as easy anymore, because the Cosmos
// config is now JSON. We can either support a serializable subset of useful
// options (like "pathRewrite") or optionally support an external config module.

type HttpProxyConfig = {
  [context: string]:
    | string
    | {
        target: string;
        secure?: boolean;
        pathRewrite?: { [rewrite: string]: string };
        logLevel?: string;
      };
};

export function httpProxy({ cosmosConfig, expressApp }: DevServerPluginArgs) {
  const httpProxyConfig = getHttpProxyCosmosConfig(cosmosConfig);
  Object.keys(httpProxyConfig).forEach(context => {
    if (typeof httpProxyConfig[context] === 'string') {
      const target = httpProxyConfig[context] as string;
      expressApp.use(context, httpProxyMiddleware(context, { target: target }));
    } else if (typeof httpProxyConfig[context] === 'object') {
      const proxy = httpProxyConfig[context] as object;
      expressApp.use(context, httpProxyMiddleware(proxy));
    }
  });
}

function getHttpProxyCosmosConfig(cosmosConfig: CosmosConfig) {
  return (cosmosConfig.httpProxy || {}) as HttpProxyConfig;
}
