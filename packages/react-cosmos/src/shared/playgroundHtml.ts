import fs from 'fs';
import { PlaygroundConfig } from 'react-cosmos-playground2';
import { replaceKeys } from './shared';
import { slash } from './slash';
import { CosmosConfig } from './config';
import { getStaticPath } from './static';

export const RENDERER_FILENAME = '_renderer.html';

export function getPlaygroundHtml(
  cosmosConfig: CosmosConfig,
  devServerOn: boolean
) {
  return replaceKeys(getPlaygroundHtmlTemplate(), {
    __PLAYGROUND_CONFIG: JSON.stringify(
      getPlaygroundConfig(cosmosConfig, devServerOn)
    )
  });
}

function getPlaygroundConfig(
  cosmosConfig: CosmosConfig,
  devServerOn: boolean
): PlaygroundConfig {
  const { publicUrl, fixturesDir, fixtureFileSuffix } = cosmosConfig;

  return {
    core: {
      projectId: cosmosConfig.rootDir,
      fixturesDir,
      fixtureFileSuffix,
      devServerOn,
      webRendererUrl: slash(publicUrl, RENDERER_FILENAME)
    }
  };
}

function getPlaygroundHtmlTemplate() {
  return fs.readFileSync(getStaticPath('index.html'), 'utf8');
}
