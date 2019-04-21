import importFrom from 'import-from';
import webpack from 'webpack';
import { RENDERER_FILENAME } from '../../../shared';
import { CosmosConfig } from '../../../config';
import { hasPlugin, isInstanceOfPlugin } from './shared';

export type HtmlWebpackPlugin = webpack.Plugin & {
  constructor: HtmlWebpackPluginConstructor;
  options: {
    title: string;
    filename: string;
  };
};

type HtmlWebpackPluginConstructor = new (args: {
  title: string;
  filename: string;
}) => HtmlWebpackPlugin;

export function ensureHtmlWebackPlugin(
  { rootDir }: CosmosConfig,
  plugins: webpack.Plugin[]
): webpack.Plugin[] {
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
      filename: RENDERER_FILENAME
    })
  ];
}

export function getHtmlWebpackPlugin(rootDir: string) {
  return importFrom.silent<HtmlWebpackPluginConstructor>(
    rootDir,
    'html-webpack-plugin'
  );
}

function isHtmlWebpackPlugin(
  plugin: webpack.Plugin
): plugin is HtmlWebpackPlugin {
  return isInstanceOfPlugin(plugin, 'HtmlWebpackPlugin');
}

function changeHtmlPluginFilename(htmlPlugin: HtmlWebpackPlugin) {
  if (htmlPlugin.options.filename !== 'index.html') {
    return htmlPlugin;
  }

  return new htmlPlugin.constructor({
    ...htmlPlugin.options,
    filename: RENDERER_FILENAME
  });
}
