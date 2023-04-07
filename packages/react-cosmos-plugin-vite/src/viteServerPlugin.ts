import { CosmosServerPlugin } from 'react-cosmos/server.js';
import { viteDevServerPlugin } from './viteDevServerPlugin.js';
import { viteExportPlugin } from './viteExportPlugin.js';

const viteServerPlugin: CosmosServerPlugin = {
  name: 'vite',
  devServer: viteDevServerPlugin,
  export: viteExportPlugin,
};

export default viteServerPlugin;
