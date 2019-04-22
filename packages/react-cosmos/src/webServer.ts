import { startDevServer } from './shared/devServer';
import { socketConnect } from './plugins/socketConnect';
import { openFile } from './plugins/openFile';
import { webpackDevServer } from './plugins/webpack';
import { httpProxy } from './plugins/httpProxy';

export async function startWebServer() {
  await startDevServer('web', [
    socketConnect,
    openFile,
    webpackDevServer,
    httpProxy
  ]);
}
