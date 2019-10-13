import { openFile } from './plugins/openFile';
import { userDepsFile } from './plugins/userDepsFile';
import { startDevServer } from './shared/devServer';

export async function startNativeServer() {
  await startDevServer('native', [userDepsFile, openFile]);
}
