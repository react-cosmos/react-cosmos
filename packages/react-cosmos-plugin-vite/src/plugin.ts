import { CosmosBuildPlugin } from 'react-cosmos';
import { viteConfigPlugin } from './viteConfigPlugin.js';
import { viteDevServerPlugin } from './viteDevServerPlugin.js';
import { viteExportPlugin } from './viteExportPlugin.js';

const plugin: CosmosBuildPlugin = {
  name: 'vite',
  config: viteConfigPlugin,
  devServer: viteDevServerPlugin,
  export: viteExportPlugin,
};

export default plugin;
