import { detectCosmosConfig } from './config';
import { httpProxy } from './plugins/httpProxy';
import { openFile } from './plugins/openFile';
import { userDepsFile } from './plugins/userDepsFile';
import { webpackDevServer } from './plugins/webpack';
import { getCliArgs } from './shared/cli';
import { startDevServer } from './shared/devServer';

export async function startWebServer() {
  const plugins = [openFile, webpackDevServer, httpProxy];
  if (shouldGenerateUserDepsFile()) plugins.push(userDepsFile);

  await startDevServer('web', plugins);
}

function shouldGenerateUserDepsFile(): boolean {
  // XXX: Make sure it's safe to detect config in here when consolidating
  // experimentalRendererUrl
  const cosmosConfig = detectCosmosConfig();
  // CLI support for --external-userdeps flag
  return (
    Boolean(getCliArgs().externalUserdeps) ||
    cosmosConfig.experimentalRendererUrl !== null
  );
}
