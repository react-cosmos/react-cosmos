import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { exposeModulesServerPlugin } from './exposeModules.js';
import { httpProxyServerPlugin } from './httpProxy.js';
import { openFileServerPlugin } from './openFile.js';
import { pluginEndpointServerPlugin } from './pluginEndpoint.js';
import { portRetryServerPlugin } from './portRetry.js';

export const coreServerPlugins: CosmosServerPlugin[] = [
  portRetryServerPlugin,
  exposeModulesServerPlugin,
  httpProxyServerPlugin,
  openFileServerPlugin,
  pluginEndpointServerPlugin,
];
