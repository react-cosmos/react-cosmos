import { startDevServer } from './devServer/startDevServer';
import { httpProxy } from './plugins/httpProxy';
import { openFile } from './plugins/openFile';
import { userDepsFile } from './plugins/userDepsFile';
import { webpackDevServer } from './plugins/webpack';

export async function startWebServer() {
  await startDevServer('web', [
    openFile,
    webpackDevServer,
    httpProxy,
    userDepsFile,
  ]);
}
