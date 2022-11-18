import fs from 'fs';
import { readFile } from 'fs/promises';
import { pkgUpSync } from 'pkg-up';
import { replaceKeys } from 'react-cosmos-core';
import url from 'url';
import {
  PlaygroundConfig,
  PlaygroundMountArgs,
} from '../../playground/index.js';
import { CosmosConfig } from '../cosmosConfig/types.js';
import {
  CosmosPluginConfig,
  PartialCosmosPluginConfig,
  PlatformType,
} from '../cosmosPlugin/types.js';
import { getStaticPath } from './staticServer.js';

export const RENDERER_FILENAME = '_renderer.html';

export async function getDevPlaygroundHtml(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  const { ui } = cosmosConfig;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: await getDevCoreConfig(platformType, cosmosConfig),
    },
    pluginConfigs,
  });
}

export async function getExportPlaygroundHtml(
  cosmosConfig: CosmosConfig,
  pluginConfigs: PartialCosmosPluginConfig[]
) {
  const { ui } = cosmosConfig;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: await getExportCoreConfig(cosmosConfig),
    },
    pluginConfigs,
  });
}

async function getDevCoreConfig(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
): Promise<PlaygroundConfig['core']> {
  switch (platformType) {
    case 'native':
      return {
        ...(await getSharedCoreConfig(cosmosConfig)),
        devServerOn: true,
        webRendererUrl: null,
      };
    case 'web':
      return {
        ...(await getSharedCoreConfig(cosmosConfig)),
        devServerOn: true,
        webRendererUrl: getWebRendererUrl(cosmosConfig),
      };
    default:
      throw new Error(`Invalid platform type: ${platformType}`);
  }
}

async function getExportCoreConfig(
  cosmosConfig: CosmosConfig
): Promise<PlaygroundConfig['core']> {
  return {
    ...(await getSharedCoreConfig(cosmosConfig)),
    devServerOn: false,
    webRendererUrl: getWebRendererUrl(cosmosConfig),
  };
}

async function getSharedCoreConfig(cosmosConfig: CosmosConfig) {
  const { rootDir, fixturesDir, fixtureFileSuffix } = cosmosConfig;
  return {
    projectId: await getProjectId(rootDir),
    fixturesDir,
    fixtureFileSuffix,
  };
}

async function getProjectId(rootDir: string) {
  const pkgPath = pkgUpSync({ cwd: rootDir });
  if (!pkgPath) {
    return rootDir.split('/').pop();
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

function getWebRendererUrl({
  publicUrl,
  experimentalRendererUrl,
}: CosmosConfig) {
  return experimentalRendererUrl || url.resolve(publicUrl, RENDERER_FILENAME);
}

function getPlaygroundHtml(playgroundArgs: PlaygroundMountArgs) {
  return replaceKeys(getPlaygroundHtmlTemplate(), {
    __PLAYGROUND_ARGS: JSON.stringify(playgroundArgs),
  });
}

function getPlaygroundHtmlTemplate() {
  return fs.readFileSync(getStaticPath('index.html'), 'utf8');
}
