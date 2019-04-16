import { socketConnect } from './plugins/socketConnect';
import { openFile } from './plugins/openFile';
import { userDepsFile } from './plugins/userDepsFile';
import { startDevServer } from './shared';

export async function startNativeServer() {
  await startDevServer('native', [userDepsFile, socketConnect, openFile]);
}
