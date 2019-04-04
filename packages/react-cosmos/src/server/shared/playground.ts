import path from 'path';
import { readFileSync } from 'fs';
import { replaceKeys } from 'react-cosmos-shared2/util';
import { PlaygroundConfig } from 'react-cosmos-playground2';
import { CosmosConfig, getRootDir, getPublicUrl } from './config';
import { slash } from './slash';

export function getPlaygroundConfig({
  cosmosConfig,
  devServerOn
}: {
  cosmosConfig: CosmosConfig;
  devServerOn: boolean;
}): PlaygroundConfig {
  const rootDir = getRootDir(cosmosConfig);
  const publicUrl = getPublicUrl(cosmosConfig);
  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;

  return {
    core: {
      projectId: rootDir,
      fixturesDir,
      fixtureFileSuffix,
      devServerOn,
      webRendererUrl: slash(publicUrl, '_loader.html')
    }
  };
}

export function getPlaygroundHtml(config: PlaygroundConfig) {
  return replaceKeys(getHtmlTemplate(), {
    __PLAYGROUND_OPTS__: JSON.stringify(config)
  });
}

function getHtmlTemplate() {
  return readFileSync(path.join(__dirname, 'static/index.html'), 'utf8');
}
