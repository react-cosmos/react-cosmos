// TODO: Bring this back
// import { watch, FSWatcher } from 'chokidar';
// import { debounce } from 'lodash';
// import {
//   COSMOS_CONFIG,
//   CosmosConfig,
//   getRootDir,
//   getPublicPath,
//   getPublicUrl
// } from '../config';
// import {
//   createHttpServer,
//   serveStaticDir
// } from '../shared/server/devServer/httpServer';
// import { createApp } from '../shared/server/devServer/app';
// import { attachSockets } from '../shared/server/devServer/socket';
// import { getPlaygroundConfig } from '../shared/server/shared/playground';
// import { generateModulesFile } from './generateModulesFile';

// // TODO: Use shared devServer with plugin for building userDepsFile
// export async function startNativeDevServer() {
//   const cosmosConfig = COSMOS_CONFIG;

//   await generateModulesFile(cosmosConfig);

//   const playgroundConfig = getPlaygroundConfig({
//     cosmosConfig,
//     devServerOn: true
//   });
//   const app = createApp(cosmosConfig, playgroundConfig);
//   const { server, startServer, stopServer } = createHttpServer(
//     cosmosConfig,
//     app
//   );

//   const publicPath = getPublicPath(cosmosConfig);
//   if (publicPath) {
//     const publicUrl = getPublicUrl(cosmosConfig);
//     serveStaticDir(app, publicUrl, publicPath);
//   }

//   const closeSockets = attachSockets(server);
//   await startServer();

//   const watcher = await startFixtureFileWatcher(cosmosConfig);

//   return async () => {
//     watcher.close();
//     await closeSockets();
//     await stopServer();
//   };
// }

// // TODO: Reuse from userDeps/findPaths
// // TODO: Add to config
// const FILE_MATCH = [
//   '**/__fixture?(s)__/**/*.{js,jsx,ts,tsx}',
//   '**/?(*.)fixture?(s).{js,jsx,ts,tsx}'
// ];
// const FILE_MATCH_IGNORE = '**/node_modules/**';

// async function startFixtureFileWatcher(
//   cosmosConfig: CosmosConfig
// ): Promise<FSWatcher> {
//   const rootDir = getRootDir(cosmosConfig);

//   return new Promise(resolve => {
//     const watcher: FSWatcher = watch(FILE_MATCH, {
//       ignored: FILE_MATCH_IGNORE,
//       ignoreInitial: true,
//       cwd: rootDir
//     })
//       .on('ready', () => resolve(watcher))
//       .on(
//         'all',
//         debounce(() => {
//           // Rebuild cosmos.modules file on fixture file changes
//           generateModulesFile(cosmosConfig);
//         }, 50)
//       );
//   });
// }
