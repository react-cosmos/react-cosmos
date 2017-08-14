import path from 'path';
import webpack from 'webpack';
import { argv } from 'yargs';
import fs from 'fs-extra';
import getLoaderWebpackConfig from './loader-webpack-config';
import getDefaultWebpackConfig from './default-webpack-config';
import importModule from 'react-cosmos-utils/lib/import-module';
import getCosmosConfig from 'react-cosmos-config';

const moduleExists = modulePath => {
  try {
    return modulePath && require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
};

const exportPlaygroundFiles = outputPath => {
  fs.copySync(
    path.join(__dirname, 'static/favicon.ico'),
    `${outputPath}/favicon.ico`
  );

  fs.copySync(
    require.resolve('react-cosmos-component-playground'),
    `${outputPath}/bundle.js`
  );

  const playgroundHtml = fs.readFileSync(
    path.join(__dirname, 'static/index.html'),
    'utf8'
  );
  const playgroundOpts = JSON.stringify({
    loaderUri: './loader/index.html',
  });
  fs.writeFileSync(
    `${outputPath}/index.html`,
    playgroundHtml.replace('__PLAYGROUND_OPTS__', playgroundOpts)
  );
};

const runWebpackCompiler = config =>
  new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });

module.exports = function startExport() {
  const cosmosConfigPath = argv.config;
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);

  const { webpackConfigPath, outputPath, publicPath, publicUrl } = cosmosConfig;

  let userWebpackConfig;
  if (moduleExists(webpackConfigPath)) {
    console.log(`[Cosmos] Using webpack config found at ${webpackConfigPath}`);
    userWebpackConfig = importModule(require(webpackConfigPath));
  } else {
    console.log(
      '[Cosmos] No webpack config found, using default configuration'
    );
    userWebpackConfig = getDefaultWebpackConfig();
  }

  const loaderWebpackConfig = getLoaderWebpackConfig(
    userWebpackConfig,
    cosmosConfigPath,
    true
  );

  // Copy static files first, so that the built index.html overrides the its
  // template file (in case the static assets are served from the root path)
  if (publicPath) {
    const exportPublicPath = path.join(outputPath, publicUrl);
    fs.copySync(publicPath, exportPublicPath);
  }

  runWebpackCompiler(loaderWebpackConfig)
    .then(() => {
      exportPlaygroundFiles(outputPath);
    })
    .then(
      () => {
        console.log('[Cosmos] Export Complete! Find the exported files here:');
        console.log(outputPath);
      },
      err => {
        console.error('[Cosmos] Export Failed! See error below:');
        console.error(err);
      }
    );
};
