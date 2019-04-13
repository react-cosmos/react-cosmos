import { socketConnect } from '../plugins/socketConnect';
import { openFile } from '../plugins/openFile';
import { startDevServer } from '../shared';
import { userDepsFile } from './userDepsFile';

export async function startNativeServer() {
  await startDevServer('native', [userDepsFile, socketConnect, openFile]);
}
