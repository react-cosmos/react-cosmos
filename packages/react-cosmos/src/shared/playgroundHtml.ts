import fs from 'fs';
import pkgUp from 'pkg-up';
import {
  PlaygroundConfig,
  PlaygroundMountArgs,
} from 'react-cosmos-playground2';
import { getCosmosPluginConfigs } from 'react-cosmos-plugin';
import url from 'url';
import { CosmosConfig } from '../config';
import { PlatformType, replaceKeys } from './shared';
import { getStaticPath } from './static';

export const RENDERER_FILENAME = '_renderer.html';

export function getDevPlaygroundHtml(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
) {
  const { rootDir, ui } = cosmosConfig;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: getDevCoreConfig(platformType, cosmosConfig),
    },
    pluginConfigs: getCosmosPluginConfigs(rootDir),
  });
}

export function getExportPlaygroundHtml(cosmosConfig: CosmosConfig) {
  const { rootDir, ui } = cosmosConfig;
  return getPlaygroundHtml({
    playgroundConfig: {
      ...ui,
      core: getExportCoreConfig(cosmosConfig),
    },
    // TODO: Ensure plugins are copied and accessible from the export path
    pluginConfigs: getCosmosPluginConfigs(rootDir),
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

function getWebRendererUrl({ publicUrl }: CosmosConfig) {
  return url.resolve(publicUrl, RENDERER_FILENAME);
}

function getPlaygroundHtml(playgroundArgs: PlaygroundMountArgs) {
  return replaceKeys(getPlaygroundHtmlTemplate(), {
    __PLAYGROUND_ARGS: JSON.stringify(playgroundArgs),
  });
}

function getPlaygroundHtmlTemplate() {
  return fs.readFileSync(getStaticPath('index.html'), 'utf8');
}
