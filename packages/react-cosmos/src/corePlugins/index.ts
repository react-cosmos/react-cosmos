import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { httpProxyServerPlugin } from './httpProxy.js';
import { openFileServerPlugin } from './openFile.js';
import { pluginEndpointServerPlugin } from './pluginEndpoint.js';
import { portRetryServerPlugin } from './portRetry.js';
import { userDepsFileServerPlugin } from './userDepsFile.js';

export const coreServerPlugins: CosmosServerPlugin[] = [
  portRetryServerPlugin,
  userDepsFileServerPlugin,
  httpProxyServerPlugin,
  openFileServerPlugin,
  pluginEndpointServerPlugin,
];
