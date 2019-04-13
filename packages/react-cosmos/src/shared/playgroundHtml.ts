import fs from 'fs';
import { PlaygroundConfig } from 'react-cosmos-playground2';
import { replaceKeys, PlatformType } from './shared';
import { slash } from './slash';
import { CosmosConfig } from './config';
import { getStaticPath } from './static';

export const RENDERER_FILENAME = '_renderer.html';

export function getDevPlaygroundHtml(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
) {
  return getPlaygroundHtml(getDevPlaygroungConfig(platformType, cosmosConfig));
}

export function getStaticPlaygroundHtml(cosmosConfig: CosmosConfig) {
  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  return getPlaygroundHtml({
    core: {
      projectId: cosmosConfig.rootDir,
      fixturesDir,
      fixtureFileSuffix,
      devServerOn: false,
      webRendererUrl: getWebRendererUrl(cosmosConfig)
    }
  });
}

function getDevPlaygroungConfig(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
): PlaygroundConfig {
  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  switch (platformType) {
    case 'native':
      return {
        core: {
          projectId: cosmosConfig.rootDir,
          fixturesDir,
          fixtureFileSuffix,
          devServerOn: true,
          webRendererUrl: null
        }
      };
    case 'web':
      return {
        core: {
          projectId: cosmosConfig.rootDir,
          fixturesDir,
          fixtureFileSuffix,
          devServerOn: true,
          webRendererUrl: getWebRendererUrl(cosmosConfig)
        }
      };
    default:
      throw new Error(`Invalid platform type: ${platformType}`);
  }
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
