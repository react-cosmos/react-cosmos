import importFrom from 'import-from';
// TODO: Test if a webpack import (require) is kept in the compiled file
import webpack from 'webpack';

export function getWebpack(rootDir: string) {
  return importFrom.silent<typeof webpack>(rootDir, 'webpack');
}

export function hasPlugin(
  { plugins }: webpack.Configuration,
  pluginName: string
) {
  return plugins && plugins.filter(p => isInstanceOf(p, pluginName)).length > 0;
}

export function isInstanceOf(plugin: webpack.Plugin, constructorName: string) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}
