import fs from 'fs';
import { PlaygroundConfig } from 'react-cosmos-playground2';
import { CosmosConfig } from '../config';
import { replaceKeys, PlatformType } from './shared';
import { slash } from './slash';
import { getStaticPath } from './static';

export const RENDERER_FILENAME = '_renderer.html';

export function getDevPlaygroundHtml(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
) {
  return getPlaygroundHtml(getDevPlaygroungConfig(platformType, cosmosConfig));
}

export function getStaticPlaygroundHtml(cosmosConfig: CosmosConfig) {
  return getPlaygroundHtml({
    core: {
      ...getSharedConfig(cosmosConfig),
      devServerOn: false,
      webRendererUrl: getWebRendererUrl(cosmosConfig)
    }
  });
}

function getDevPlaygroungConfig(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
): PlaygroundConfig {
  switch (platformType) {
    case 'native':
      return {
        core: {
          ...getSharedConfig(cosmosConfig),
          devServerOn: true,
          webRendererUrl: null
        }
      };
    case 'web':
      return {
        core: {
          ...getSharedConfig(cosmosConfig),
          devServerOn: true,
          webRendererUrl: getWebRendererUrl(cosmosConfig)
        }
      };
    default:
      throw new Error(`Invalid platform type: ${platformType}`);
  }
}

function getSharedConfig(cosmosConfig: CosmosConfig) {
  const { rootDir, fixturesDir, fixtureFileSuffix } = cosmosConfig;
  return { projectId: rootDir, fixturesDir, fixtureFileSuffix };
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
