// TODO: Test if a webpack import (require) is kept in the compiled file
import webpack from 'webpack';

export function hasPlugin(
  { plugins }: webpack.Configuration,
  pluginName: string
) {
  return (
    plugins && plugins.filter(p => isInstanceOfPlugin(p, pluginName)).length > 0
  );
}

export function isInstanceOfPlugin(
  plugin: webpack.Plugin,
  constructorName: string
) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}
