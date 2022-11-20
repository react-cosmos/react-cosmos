import { Options as HtmlWebpackPluginOptions } from 'html-webpack-plugin';
import lodash from 'lodash';
import {
  CosmosConfig,
  requireFromSilent,
  RENDERER_FILENAME,
} from 'react-cosmos/server.js';
import webpack from 'webpack';
import { hasPlugin, isInstanceOfWebpackPlugin } from './plugins.js';

// prettier-ignore
export type HtmlWebpackPlugin = webpack.WebpackPluginInstance & {
  constructor: HtmlWebpackPluginConstructor;
} & (
  | { options: HtmlWebpackPluginOptions; userOptions: undefined } // html-webpack-plugin < 5
  | { userOptions: HtmlWebpackPluginOptions; options: undefined } // html-webpack-plugin >= 5
  );

type HtmlWebpackPluginConstructor = new (
  options?: HtmlWebpackPluginOptions
) => HtmlWebpackPlugin;

export function ensureHtmlWebackPlugin(
  { rootDir }: CosmosConfig,
  plugins: webpack.WebpackPluginInstance[]
): webpack.WebpackPluginInstance[] {
  if (hasPlugin(plugins, 'HtmlWebpackPlugin')) {
    return plugins.map(plugin =>
      isHtmlWebpackPlugin(plugin) ? changeHtmlPluginFilename(plugin) : plugin
    );
  }

  const htmlWebpackPlugin = getHtmlWebpackPlugin(rootDir);
  if (!htmlWebpackPlugin) {
    return plugins;
  }

  return [
    ...plugins,
    new htmlWebpackPlugin({
      title: 'React Cosmos',
      filename: RENDERER_FILENAME,
    }),
  ];
}

export function getHtmlWebpackPlugin(rootDir: string) {
  return requireFromSilent(
    rootDir,
    'html-webpack-plugin'
  ) as HtmlWebpackPluginConstructor;
}

function isHtmlWebpackPlugin(
  plugin: webpack.WebpackPluginInstance
): plugin is HtmlWebpackPlugin {
  return isInstanceOfWebpackPlugin(plugin, 'HtmlWebpackPlugin');
}

function changeHtmlPluginFilename(htmlPlugin: HtmlWebpackPlugin) {
  if (!isIndexHtmlWebpackPlugin(htmlPlugin)) return htmlPlugin;

  const options = htmlPlugin.userOptions || htmlPlugin.options;
  const safeOptions = lodash.omit(options, 'chunks');

  return new htmlPlugin.constructor({
    ...safeOptions,
    filename: RENDERER_FILENAME,
  });
}

function isIndexHtmlWebpackPlugin(htmlPlugin: HtmlWebpackPlugin) {
  const { filename } = htmlPlugin.userOptions || htmlPlugin.options;
  return (
    filename === 'index.html' ||
    typeof filename !== 'string' ||
    filename.endsWith('/index.html')
  );
}
