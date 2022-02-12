import { startDevServer } from './devServer/startDevServer';
import { generateExport } from './export/generateExport';
import { httpProxy } from './plugins/httpProxy';
import { openFile } from './plugins/openFile';
import { userDepsFile } from './plugins/userDepsFile';
import { webpackDevServer, webpackExport } from './plugins/webpack';

export { createCosmosConfig } from './config/createCosmosConfig';
export { detectCosmosConfig } from './config/detectCosmosConfig';
export { getCosmosConfigAtPath } from './config/getCosmosConfigAtPath';
export { getFixtures, getFixturesSync } from './getFixtures';
export { FixtureApi, getFixtures2 } from './getFixtures2';
export { getFixtureUrls, getFixtureUrlsSync } from './getFixtureUrls';

export async function startWebServer() {
  await startDevServer('web', [
    openFile,
    webpackDevServer,
    httpProxy,
    userDepsFile,
  ]);
}

export async function startNativeServer() {
  await startDevServer('native', [userDepsFile, openFile]);
}

export async function generateWebExport() {
  await generateExport([webpackExport]);
}
