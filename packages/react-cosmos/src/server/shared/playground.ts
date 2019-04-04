import path from 'path';
import { readFileSync } from 'fs';
import { replaceKeys } from 'react-cosmos-shared2/util';
import { PlaygroundConfig } from 'react-cosmos-playground2';
import { CosmosConfig } from './config';

export function getPlaygroundConfig({
  cosmosConfig,
  devServerOn,
  projectId,
  webRendererUrl
}: {
  cosmosConfig: CosmosConfig;
  devServerOn: boolean;
  projectId: string;
  webRendererUrl: string | null;
}): PlaygroundConfig {
  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  return {
    core: {
      projectId,
      fixturesDir,
      fixtureFileSuffix,
      devServerOn,
      webRendererUrl
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
