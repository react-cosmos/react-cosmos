import { CosmosConfig } from 'react-cosmos';
import webpack from 'webpack';
import { getWebpackNodeEnv } from './getWebpackNodeEnv.js';

export function getGlobalsPlugin(
  { publicUrl }: CosmosConfig,
  userWebpack: typeof webpack,
  devServerOn: boolean
) {
  const cleanPublicUrl = removeTrailingSlash(publicUrl);
  return new userWebpack.DefinePlugin({
    // "if (__DEV__)" blocks get stripped when compiling a static export build
    __DEV__: JSON.stringify(devServerOn),
    'process.env.NODE_ENV': JSON.stringify(getWebpackNodeEnv()),
    'process.env.PUBLIC_URL': JSON.stringify(cleanPublicUrl),
  });
}

export function hasPlugin(
  plugins: void | webpack.WebpackPluginInstance[],
  pluginName: string
) {
  return (
    plugins &&
    plugins.filter(p => isInstanceOfWebpackPlugin(p, pluginName)).length > 0
  );
}

export function isInstanceOfWebpackPlugin(
  plugin: webpack.WebpackPluginInstance,
  constructorName: string
) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}

export function ignoreEmptyWebpackPlugins(
  plugins: webpack.Configuration['plugins'] = []
) {
  return plugins.filter(Boolean) as webpack.WebpackPluginInstance[];
}

function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, '');
}
