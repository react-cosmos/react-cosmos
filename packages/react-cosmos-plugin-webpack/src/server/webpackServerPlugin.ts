import { CosmosServerPlugin } from 'react-cosmos/server.js';
import { webpackDevServerPlugin } from './webpackDevServerPlugin.js';
import { webpackExportPlugin } from './webpackExportPlugin.js';

const webpackServerPlugin: CosmosServerPlugin = {
  name: 'webpack',
  devServer: webpackDevServerPlugin,
  export: webpackExportPlugin,
};

export default webpackServerPlugin;
