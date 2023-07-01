import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { exposeImportsPlugin } from './exposeImportsPlugin.js';
import { httpProxyPlugin } from './httpProxyPlugin.js';
import { openFilePlugin } from './openFilePlugin.js';
import { pluginEndpointPlugin } from './pluginEndpointPlugin.js';
import { portRetryPlugin } from './portRetryPlugin.js';

export const coreServerPlugins: CosmosServerPlugin[] = [
  portRetryPlugin,
  exposeImportsPlugin,
  httpProxyPlugin,
  openFilePlugin,
  pluginEndpointPlugin,
];
