import { httpProxy } from './plugins/httpProxy';
import { openFile } from './plugins/openFile';
import { userDepsFile } from './plugins/userDepsFile';
import { webpackDevServer } from './plugins/webpack';
import { getCliArgs } from './shared/cli';
import { startDevServer } from './shared/devServer';

export async function startWebServer() {
  const plugins = [openFile, webpackDevServer, httpProxy];
  if (shouldGenerateUserDepsFile()) {
    plugins.push(userDepsFile);
  }
  await startDevServer('web', plugins);
}

function shouldGenerateUserDepsFile(): boolean {
  // CLI support for --external-userdeps flag
  return Boolean(getCliArgs().externalUserdeps);
}
