import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import {
  CosmosPluginConfig,
  pickRendererUrl,
  replaceKeys,
} from 'react-cosmos-core';
import { PlaygroundMountArgs } from 'react-cosmos-ui';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform } from '../cosmosPlugin/types.js';
import { findUp } from '../utils/findUp.js';
import { getServerFixtureList } from './serverFixtureList.js';
import { getStaticPath } from './staticPath.js';

export async function getDevPlaygroundHtml(
  platform: CosmosPlatform,
  config: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  const { ui } = config;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: await getCoreConfig(config, true),
      rendererCore: {
        fixtures: await getServerFixtureList(config),
        rendererUrl:
          platform === 'web'
            ? pickRendererUrl(config.rendererUrl, 'dev')
            : null,
      },
    },
    pluginConfigs,
  });
}

export async function getExportPlaygroundHtml(
  config: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  const { ui } = config;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: await getCoreConfig(config, false),
      rendererCore: {
        fixtures: await getServerFixtureList(config),
        rendererUrl: pickRendererUrl(config.rendererUrl, 'export'),
      },
    },
    pluginConfigs,
  });
}

async function getCoreConfig(config: CosmosConfig, devServerOn: boolean) {
  const { rootDir, fixturesDir, fixtureFileSuffix } = config;
  return {
    projectId: await getProjectId(rootDir),
    fixturesDir,
    fixtureFileSuffix,
    devServerOn,
  };
}

async function getProjectId(rootDir: string) {
  const pkgPath = await findUp('package.json', rootDir);
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
