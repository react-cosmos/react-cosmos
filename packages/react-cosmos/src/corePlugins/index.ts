import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { fixtureWatcherPlugin } from './fixtureWatcherPlugin.js';
import { httpProxyPlugin } from './httpProxyPlugin.js';
import { openFilePlugin } from './openFilePlugin.js';
import { pluginEndpointPlugin } from './pluginEndpointPlugin.js';
import { portRetryPlugin } from './portRetryPlugin.js';

export const coreServerPlugins: CosmosServerPlugin[] = [
  portRetryPlugin,
  fixtureWatcherPlugin,
  httpProxyPlugin,
  openFilePlugin,
  pluginEndpointPlugin,
];
