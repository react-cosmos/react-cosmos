import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { fixtureWatcherPlugin } from './fixtureWatcherPlugin.js';
import { fixturesJsonPlugin } from './fixturesJsonPlugin.js';
import { httpProxyPlugin } from './httpProxyPlugin.js';
import { openFilePlugin } from './openFilePlugin.js';
import { pluginEndpointPlugin } from './pluginEndpointPlugin.js';
import { portRetryPlugin } from './portRetryPlugin.js';

export const coreServerPlugins: CosmosServerPlugin[] = [
  portRetryPlugin,
  fixturesJsonPlugin,
  httpProxyPlugin,
  openFilePlugin,
  pluginEndpointPlugin,
];

// Omit starting chokidar in Jest tests for performance reasons
if (process.env.JEST_WORKER_ID === undefined) {
  coreServerPlugins.push(fixtureWatcherPlugin);
}
