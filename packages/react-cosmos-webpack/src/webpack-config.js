import webpack from 'webpack';
import buildModulePaths from './build-module-paths';
import getConfig from './config';
import resolveUserPath from './resolve-user-path';

export default function getWebpackConfig(
  userWebpackConfig,
  cosmosConfigPath
) {
  // eslint-disable-next-line global-require
  const cosmosConfig = getConfig(require(cosmosConfigPath));

  const {
    componentPaths,
    globalImports,
    hot,
    ignore,
  } = cosmosConfig;

  const resolvedComponentPaths = componentPaths.map(
    path => resolveUserPath(path, cosmosConfigPath));
  const resolvedGlobalImports = globalImports.map(
    path => resolveUserPath(path, cosmosConfigPath));

  const {
    components,
    fixtures,
  } = buildModulePaths(resolvedComponentPaths, ignore);

  const entry = [...resolvedGlobalImports];

  if (hot) {
    // It's crucial for Cosmos to not depend on any user loader. This way the
    // webpack configs can point solely to the user deps for loaders.
    entry.push(require.resolve('webpack-hot-middleware/client'));
  }

  entry.push(`${require.resolve('./entry-loader')}?${JSON.stringify({
    // We escape the contents because component or fixture paths might contain
    // an ! (exclamation point), which throws webpack off thinking everything
    // after is the entry file path.
    components: escape(components),
    fixtures: escape(fixtures),
  })}!${require.resolve('./entry')}`);

  const output = {
    // Webpack doesn't write to this path when saving build in memory (as
    // react-cosmos-webpack does), but webpack-dev-middleware seems to crash
    // without it
    path: '/',
    // Also not a real file. HtmlWebpackPlugin uses this path for the script
    // tag it injects.
    filename: 'bundle.js',
    publicPath: '/',
  };

  const plugins = userWebpackConfig.plugins ? [...userWebpackConfig.plugins] : [];

  plugins.push(new webpack.DefinePlugin({
    COSMOS_CONFIG_PATH: JSON.stringify(cosmosConfigPath),
  }));

  return {
    ...userWebpackConfig,
    entry,
    output,
    plugins,
  };
}
