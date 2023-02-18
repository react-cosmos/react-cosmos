import fs from 'fs';
import { readFile } from 'fs/promises';
import { pkgUpSync } from 'pkg-up';
import { CosmosPluginConfig, replaceKeys } from 'react-cosmos-core';
import { PlaygroundConfig, PlaygroundMountArgs } from 'react-cosmos-ui';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { PlatformType } from '../cosmosPlugin/types.js';
import { resolveUrlPath } from './resolveUrlPath.js';
import { getStaticPath } from './staticPath.js';

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
  pluginConfigs: CosmosPluginConfig[]
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

function getWebRendererUrl({ publicUrl, rendererUrl }: CosmosConfig) {
  return rendererUrl || resolveUrlPath(publicUrl, RENDERER_FILENAME);
}

function getPlaygroundHtml(playgroundArgs: PlaygroundMountArgs) {
  return replaceKeys(getPlaygroundHtmlTemplate(), {
    __PLAYGROUND_ARGS: JSON.stringify(playgroundArgs),
  });
}

function getPlaygroundHtmlTemplate() {
  return fs.readFileSync(getStaticPath('index.html'), 'utf8');
}
