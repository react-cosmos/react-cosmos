import { socketConnect } from './plugins/socketConnect';
import { openFile } from './plugins/openFile';
import { webpackDevServer } from './plugins/webpack';
import { startDevServer } from './shared/devServer';

export async function startWebServer() {
  await startDevServer('web', [socketConnect, openFile, webpackDevServer]);
}
