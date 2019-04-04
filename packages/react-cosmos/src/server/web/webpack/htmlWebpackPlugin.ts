import importFrom from 'import-from';
// TODO: Test if a webpack import (require) is kept in the compiled file
import webpack from 'webpack';
import { isInstanceOf } from './shared';

type HtmlWebpackPlugin = webpack.Plugin & {
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

export function getHtmlWebpackPlugin(rootDir: string) {
  return importFrom.silent<HtmlWebpackPluginConstructor>(
    rootDir,
    'html-webpack-plugin'
  );
}

export function isHtmlWebpackPlugin(
  plugin: webpack.Plugin
): plugin is HtmlWebpackPlugin {
  return isInstanceOf(plugin, 'HtmlWebpackPlugin');
}

export function changeHtmlPluginFilename(htmlPlugin: HtmlWebpackPlugin) {
  if (htmlPlugin.options.filename !== 'index.html') {
    return htmlPlugin;
  }

  return new htmlPlugin.constructor({
    ...htmlPlugin.options,
    filename: '_loader.html'
  });
}
