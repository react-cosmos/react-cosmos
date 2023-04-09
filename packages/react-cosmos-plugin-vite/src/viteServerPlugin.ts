import { CosmosServerPlugin } from 'react-cosmos/server.js';
import { viteConfigPlugin } from './viteConfigPlugin.js';
import { viteDevServerPlugin } from './viteDevServerPlugin.js';
import { viteExportPlugin } from './viteExportPlugin.js';

const viteServerPlugin: CosmosServerPlugin = {
  name: 'vite',
  config: viteConfigPlugin,
  devServer: viteDevServerPlugin,
  export: viteExportPlugin,
};

export default viteServerPlugin;
