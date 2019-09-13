import fs from 'fs';
import pkgUp from 'pkg-up';
import { PlaygroundConfig } from 'react-cosmos-playground2';
import { CosmosConfig } from '../config';
import { PlatformType, replaceKeys } from './shared';
import { slash } from './slash';
import { getStaticPath } from './static';

export const RENDERER_FILENAME = '_renderer.html';

export function getDevPlaygroundHtml(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
) {
  const { ui } = cosmosConfig;
  return getPlaygroundHtml({
    ...ui,
    core: getDevCoreConfig(platformType, cosmosConfig)
  });
}

export function getExportPlaygroundHtml(cosmosConfig: CosmosConfig) {
  const { ui } = cosmosConfig;
  return getPlaygroundHtml({
    ...ui,
    core: getExportCoreConfig(cosmosConfig)
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
        webRendererUrl: null
      };
    case 'web':
      return {
        ...getSharedCoreConfig(cosmosConfig),
        devServerOn: true,
        webRendererUrl: getWebRendererUrl(cosmosConfig)
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
    webRendererUrl: getWebRendererUrl(cosmosConfig)
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
  return slash(publicUrl, RENDERER_FILENAME);
}

function getPlaygroundHtml(playgroundConfig: PlaygroundConfig) {
  return replaceKeys(getPlaygroundHtmlTemplate(), {
    __PLAYGROUND_CONFIG: JSON.stringify(playgroundConfig)
  });
}

function getPlaygroundHtmlTemplate() {
  return fs.readFileSync(getStaticPath('index.html'), 'utf8');
}
