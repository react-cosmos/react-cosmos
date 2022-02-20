import fs from 'fs';
import pkgUp from 'pkg-up';
import {
  PlaygroundConfig,
  PlaygroundMountArgs,
} from 'react-cosmos-playground2';
import { CosmosPluginConfig } from 'react-cosmos-plugin';
import url from 'url';
import { CosmosConfig } from '../config/shared';
import { getStaticPath } from './static';
import { PlatformType } from './types';
import { replaceKeys } from './utils';

export const RENDERER_FILENAME = '_renderer.html';

export function getDevPlaygroundHtml(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  const { ui } = cosmosConfig;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: getDevCoreConfig(platformType, cosmosConfig),
    },
    pluginConfigs,
  });
}

export function getExportPlaygroundHtml(
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  const { ui } = cosmosConfig;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: getExportCoreConfig(cosmosConfig),
    },
    pluginConfigs,
  });
}

function getDevCoreConfig(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
): PlaygroundConfig['core'] {
  switch (platformType) {
    case 'native':
      return {
        ...getSharedCoreConfig(cosmosConfig),
        devServerOn: true,
        webRendererUrl: null,
      };
    case 'web':
      return {
        ...getSharedCoreConfig(cosmosConfig),
        devServerOn: true,
        webRendererUrl: getWebRendererUrl(cosmosConfig),
      };
    default:
      throw new Error(`Invalid platform type: ${platformType}`);
  }
}

function getExportCoreConfig(
  cosmosConfig: CosmosConfig
): PlaygroundConfig['core'] {
  return {
    ...getSharedCoreConfig(cosmosConfig),
    devServerOn: false,
    webRendererUrl: getWebRendererUrl(cosmosConfig),
  };
}

function getSharedCoreConfig(cosmosConfig: CosmosConfig) {
  const { rootDir, fixturesDir, fixtureFileSuffix } = cosmosConfig;
  return { projectId: getProjectId(rootDir), fixturesDir, fixtureFileSuffix };
}

function getProjectId(rootDir: string) {
  const pkgPath = pkgUp.sync({ cwd: rootDir });
  if (!pkgPath) {
    return rootDir.split('/').pop();
  }

  const pkg = require(pkgPath);
  return pkg.name || '';
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
