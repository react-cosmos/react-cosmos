import webpack from 'webpack';
import importModule from 'react-cosmos-utils/lib/import-module';
import splitUnserializableParts from 'react-cosmos-utils/lib/unserializable-parts';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from 'react-cosmos-voyager';

const { keys } = Object;

const extractSerializableBodyFromFixtures = fixtures =>
  keys(fixtures).reduce((components, componentName) => {
    components[componentName] = keys(fixtures[componentName]).reduce(
      (componentFixtures, fixtureName) => {
        const fixture = importModule(require(fixtures[componentName][fixtureName]));
        const { serializable } = splitUnserializableParts(fixture);
        componentFixtures[fixtureName] = serializable;
        return componentFixtures;
      }, {});
    return components;
  }, {});

export default function getPlaygroundWebpackConfig(
  cosmosConfigPath,
  shouldExport = false
) {
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);
  const { outputPath } = cosmosConfig;
  const { fixtures } = getFilePaths(cosmosConfig);

  return {
    entry: require.resolve('./entry-playground'),
    output: {
      path: shouldExport ? outputPath : '/',
      filename: 'bundle.js',
      publicPath: shouldExport ? './' : '/',
    },
    plugins: [
      new webpack.DefinePlugin({
        // Embed the serializable part of fixtures in the Playground bundle in
        // order for them to be shown in the fixture editor
        COSMOS_FIXTURES: JSON.stringify(
          extractSerializableBodyFromFixtures(fixtures))
      })
    ],
  };
}
