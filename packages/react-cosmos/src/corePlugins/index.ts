import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { exposeImportsServerPlugin } from './exposeImports.js';
import { httpProxyServerPlugin } from './httpProxy.js';
import { openFileServerPlugin } from './openFile.js';
import { pluginEndpointServerPlugin } from './pluginEndpoint.js';
import { portRetryServerPlugin } from './portRetry.js';

export const coreServerPlugins: CosmosServerPlugin[] = [
  portRetryServerPlugin,
  exposeImportsServerPlugin,
  httpProxyServerPlugin,
  openFileServerPlugin,
  pluginEndpointServerPlugin,
];
