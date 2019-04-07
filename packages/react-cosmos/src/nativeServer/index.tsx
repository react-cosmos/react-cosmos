import { startDevServer } from '../shared/devServer';
// import { userDepsFile } from '../plugins/userDeps' ???
// import { openFile } from '../plugins/openFile'

export async function startNativeServer() {
  await startDevServer();
  // await startDevServer([webpackServer, openFile]);
}
