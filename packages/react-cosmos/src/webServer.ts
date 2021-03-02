import { httpProxy } from './plugins/httpProxy';
import { openFile } from './plugins/openFile';
import { userDepsFile } from './plugins/userDepsFile';
import { webpackDevServer } from './plugins/webpack';
import { startDevServer } from './shared/devServer';

export async function startWebServer() {
  await startDevServer('web', [
    openFile,
    webpackDevServer,
    httpProxy,
    userDepsFile,
  ]);
}
