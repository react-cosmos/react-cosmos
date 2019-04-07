import { socketConnect } from './plugins/socketConnect';
import { webpackServer } from './plugins/webpack';
import { openFile } from './plugins/openFile';
import { startDevServer } from './shared';

export async function startWebServer() {
  await startDevServer([socketConnect, webpackServer, openFile]);
}
