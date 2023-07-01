import { CosmosBuildPlugin } from 'react-cosmos';
import { webpackConfigPlugin } from './webpackConfigPlugin.js';
import { webpackDevServerPlugin } from './webpackDevServerPlugin.js';
import { webpackExportPlugin } from './webpackExportPlugin.js';

const plugin: CosmosBuildPlugin = {
  name: 'webpack',
  config: webpackConfigPlugin,
  devServer: webpackDevServerPlugin,
  export: webpackExportPlugin,
};

export default plugin;
