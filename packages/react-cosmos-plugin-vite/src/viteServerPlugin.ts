import { CosmosServerPlugin } from 'react-cosmos/server.js';
import { viteConfigPluginHook } from './viteConfigPluginHook.js';
import { viteDevServerPluginHook } from './viteDevServerPluginHook.js';
import { viteExportPluginHook } from './viteExportPluginHook.js';

const viteServerPlugin: CosmosServerPlugin = {
  name: 'vite',
  config: viteConfigPluginHook,
  devServer: viteDevServerPluginHook,
  export: viteExportPluginHook,
};

export default viteServerPlugin;
