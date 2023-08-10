import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { pkgUpSync } from 'pkg-up';
import {
  CosmosPluginConfig,
  pickRendererUrl,
  replaceKeys,
} from 'react-cosmos-core';
import { PlaygroundMountArgs } from 'react-cosmos-ui';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform } from '../cosmosPlugin/types.js';
import { getServerFixtureList } from './serverFixtureList.js';
import { getStaticPath } from './staticPath.js';

export async function getDevPlaygroundHtml(
  platform: CosmosPlatform,
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  const { ui } = cosmosConfig;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: await getCoreConfig(cosmosConfig, true),
      rendererCore: {
        fixtures: getServerFixtureList(cosmosConfig),
        rendererUrl:
          platform === 'web'
            ? pickRendererUrl(cosmosConfig.rendererUrl, 'dev')
            : null,
      },
    },
    pluginConfigs,
  });
}

export async function getExportPlaygroundHtml(
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  const { ui } = cosmosConfig;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: await getCoreConfig(cosmosConfig, false),
      rendererCore: {
        fixtures: getServerFixtureList(cosmosConfig),
        rendererUrl: pickRendererUrl(cosmosConfig.rendererUrl, 'export'),
      },
    },
    pluginConfigs,
  });
}

async function getCoreConfig(cosmosConfig: CosmosConfig, devServerOn: boolean) {
  const { rootDir, fixturesDir, fixtureFileSuffix } = cosmosConfig;
  return {
    projectId: await getProjectId(rootDir),
    fixturesDir,
    fixtureFileSuffix,
    devServerOn,
  };
}

async function getProjectId(rootDir: string) {
  const pkgPath = pkgUpSync({ cwd: rootDir });
  if (!pkgPath) {
    return rootDir.split(path.sep).pop();
  }

  try {
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
    return pkg.name || 'new-project';
  } catch (err) {
    console.log('Failed to read package.json');
    console.log(err);
    return 'new-project';
  }
}

function getPlaygroundHtml(playgroundArgs: PlaygroundMountArgs) {
  return replaceKeys(getPlaygroundHtmlTemplate(), {
    __PLAYGROUND_ARGS: JSON.stringify(playgroundArgs),
  });
}

function getPlaygroundHtmlTemplate() {
  return fs.readFileSync(getStaticPath('index.html'), 'utf8');
}
