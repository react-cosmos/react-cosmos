import { CosmosConfig } from '../config/shared';
import httpProxyMiddleware from 'http-proxy-middleware';
import { DevServerPluginArgs } from '../shared/devServer';

// TODO: Support advanced configuration
// See https://github.com/react-cosmos/react-cosmos/pull/875 for context
// Supporting all httpProxy options isn't as easy anymore, because the Cosmos
// config is now JSON. We can either support a serializable subset of useful
// options (like "pathRewrite") or optionally support an external config module.
type HttpProxyConfig = { [context: string]: string };

export function httpProxy({ cosmosConfig, expressApp }: DevServerPluginArgs) {
  const httpProxyConfig = getHttpProxyCosmosConfig(cosmosConfig);
  Object.keys(httpProxyConfig).forEach(context => {
    const target = httpProxyConfig[context];
    expressApp.use(context, httpProxyMiddleware(context, { target }));
  });
}

function getHttpProxyCosmosConfig(cosmosConfig: CosmosConfig) {
  return (cosmosConfig.httpProxy || {}) as HttpProxyConfig;
}
