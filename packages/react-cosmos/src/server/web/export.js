// @flow

import path from 'path';
import fs from 'fs-extra';
import { silent as silentImport } from 'import-from';
import { getCosmosConfig } from 'react-cosmos-config';
import {
  getPlaygroundHtml,
  getPlaygroundHtmlNext
} from '../shared/playground-html';
import enhanceWebpackConfig from './webpack/enhance-webpack-config';
import { getUserWebpackConfig } from './webpack/user-webpack-config';
import { getPlaygroundOpts } from './playground-opts';

const exportPlaygroundFiles = (cosmosConfig, outputPath) => {
  const { next } = cosmosConfig;

  fs.copySync(
    path.join(__dirname, '../shared/static/favicon.ico'),
    `${outputPath}/_cosmos.ico`
  );

  fs.copySync(
    require.resolve(
      next ? 'react-cosmos-playground2' : 'react-cosmos-playground'
    ),
    `${outputPath}/_playground.js`
  );

  const playgroundOpts = getPlaygroundOpts(cosmosConfig);
  const playgroundHtml = next
    ? getPlaygroundHtmlNext({
        rendererPreviewUrl: playgroundOpts.loaderUri,
        enableRemoteRenderers: false
      })
    : getPlaygroundHtml(playgroundOpts);
  fs.writeFileSync(`${outputPath}/index.html`, playgroundHtml);
};

const runWebpackCompiler = (webpack, config) =>
  new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        const error = new Error('Errors occurred');
        // $FlowFixMe
        error.webpackErrors = stats.toJson().errors;
        reject(error);
      } else {
        resolve(stats);
      }
    });
  });

export async function generateExport() {
  const cosmosConfig = getCosmosConfig();
  const { rootPath, outputPath, publicPath, publicUrl } = cosmosConfig;

  const webpack = silentImport(rootPath, 'webpack');
  if (!webpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log('Install using "yarn add webpack" or "npm install webpack"');
    return;
  }

  const userWebpackConfig = getUserWebpackConfig(cosmosConfig);
  const loaderWebpackConfig = enhanceWebpackConfig({
    webpack,
    userWebpackConfig,
    shouldExport: true
  });

  // Copy static files first, so that the built index.html overrides the its
  // template file (in case the static assets are served from the root path)
  if (publicPath) {
    if (outputPath.indexOf(publicPath) === -1) {
      const exportPublicPath = path.join(outputPath, publicUrl);
      if (fs.existsSync(publicPath)) {
        fs.copySync(publicPath, exportPublicPath);
      } else {
        console.log(
          '[Cosmos] Warning: config.publicPath points to missing dir',
          publicPath
        );
      }
    } else {
      console.warn(
        `[Cosmos] Warning: Can't export public path because it contains the export path! (avoiding infinite loop)`
      );
      console.warn('Public path:', publicPath);
      console.warn('Export path:', outputPath);
    }
  }

  await runWebpackCompiler(webpack, loaderWebpackConfig)
    .then(() => {
      exportPlaygroundFiles(cosmosConfig, outputPath);
    })
    .then(
      () => {
        console.log('[Cosmos] Export Complete! Find the exported files here:');
        console.log(outputPath);
      },
      err => {
        console.error('[Cosmos] Export Failed! See errors below:\n');
        if (err.webpackErrors) {
          err.webpackErrors.forEach(error => {
            console.error(`${error}\n`);
          });
        } else {
          console.error(err);
        }
        process.exit(1);
      }
    );
}
