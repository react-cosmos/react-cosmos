import { startDevServer } from './devServer/startDevServer';
import { openFile } from './plugins/openFile';
import { userDepsFile } from './plugins/userDepsFile';

export async function startNativeServer() {
  await startDevServer('native', [userDepsFile, openFile]);
}
