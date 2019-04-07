// TODO: Bring this back
// import path from 'path';
// import fs from 'fs-extra';
// // TODO: Test if a webpack import (require) is kept in the compiled file
// // import webpack from 'webpack';
// import {
//   CosmosConfig,
//   // getRootDir,
//   getExportPath,
//   getPublicUrl,
//   COSMOS_CONFIG,
//   getPublicPath
// } from '../../config';
// import { getPlaygroundConfig, getPlaygroundHtml } from './shared/playground';
// // Remove webpack references from this file
// // import {
// //   getWebpack,
// //   getUserWebpackConfig,
// //   enhanceWebpackConfig
// // } from '../server/web/webpack';

// // TODO:
// type ExportPlugin = {};

// export async function generateWebExport() {
//   // await generateExport([webpackExport])
// }

// export async function generateExport(plugins: ExportPlugin[] = []) {
//   const cosmosConfig = COSMOS_CONFIG;

//   // const rootDir = getRootDir(cosmosConfig);
//   // const userWebpack = getWebpack(rootDir);
//   // if (!userWebpack) {
//   //   console.warn('[Cosmos] webpack dependency missing!');
//   //   console.log('Install using "yarn add webpack" or "npm install webpack"');
//   //   return;
//   // }

//   // const userWebpackConfig = getUserWebpackConfig(cosmosConfig, userWebpack);
//   // const webpackConfig = enhanceWebpackConfig({
//   //   cosmosConfig,
//   //   userWebpack,
//   //   userWebpackConfig,
//   //   staticBuild: true
//   // });

//   // Copy static files first, so that the built index.html overrides the its
//   // template file (in case the static assets are served from the root path)
//   copyStaticFiles(cosmosConfig);

//   // await runWebpackCompiler(userWebpack, webpackConfig)
//   //   .then(() => exportPlaygroundFiles(cosmosConfig))
//   //   .then(() => {
//   //     const exportPath = getExportPath(cosmosConfig);
//   //     console.log('[Cosmos] Export Complete! Find the exported files here:');
//   //     console.log(exportPath);
//   //   })
//   //   .catch(err => {
//   //     console.error('[Cosmos] Export Failed! See errors below:\n');
//   //     if (err.webpackErrors) {
//   //       err.webpackErrors.forEach((error: Error) => {
//   //         console.error(`${error}\n`);
//   //       });
//   //     } else {
//   //       console.error(err);
//   //     }
//   //     process.exit(1);
//   //   });

//   exportPlaygroundFiles(cosmosConfig);
// }

// function copyStaticFiles(cosmosConfig: CosmosConfig) {
//   const publicPath = getPublicPath(cosmosConfig);
//   if (!publicPath) {
//     return;
//   }

//   const exportPath = getExportPath(cosmosConfig);
//   if (exportPath.indexOf(publicPath) !== -1) {
//     console.warn(
//       `[Cosmos] Warning: Can't export public path because it contains the export path! (avoiding infinite loop)`
//     );
//     console.warn('Public path:', publicPath);
//     console.warn('Export path:', exportPath);
//     return;
//   }

//   if (!fs.existsSync(publicPath)) {
//     console.log(
//       '[Cosmos] Warning: config.publicPath points to missing dir',
//       publicPath
//     );
//     return;
//   }

//   const publicUrl = getPublicUrl(cosmosConfig);
//   const exportPublicPath = path.join(exportPath, publicUrl);
//   fs.copySync(publicPath, exportPublicPath);
// }

// function exportPlaygroundFiles(cosmosConfig: CosmosConfig) {
//   const exportPath = getExportPath(cosmosConfig);

//   fs.copySync(
//     require.resolve('react-cosmos-playground2/dist'),
//     `${exportPath}/_playground.js`
//   );
//   fs.copySync(
//     path.join(__dirname, '../shared/static/favicon.ico'),
//     `${exportPath}/_cosmos.ico`
//   );

//   const playgroundHtml = getPlaygroundHtml(
//     getPlaygroundConfig({
//       cosmosConfig,
//       devServerOn: false
//     })
//   );
//   fs.writeFileSync(`${exportPath}/index.html`, playgroundHtml);
// }

// // function runWebpackCompiler(
// //   userWebpack: typeof webpack,
// //   webpackConfig: webpack.Configuration
// // ) {
// //   return new Promise((resolve, reject) => {
// //     const compiler = userWebpack(webpackConfig);
// //     compiler.run((err, stats) => {
// //       if (err) {
// //         reject(err);
// //       } else if (stats.hasErrors()) {
// //         const error = new WebpackCompilationError();
// //         error.webpackErrors = stats.toJson().errors;
// //         reject(error);
// //       } else {
// //         resolve(stats);
// //       }
// //     });
// //   });
// // }

// // class WebpackCompilationError extends Error {
// //   webpackErrors: any;
// //   constructor() {
// //     super('Webpack errors occurred');
// //   }
// // }
