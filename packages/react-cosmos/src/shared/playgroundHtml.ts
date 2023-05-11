import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { pkgUpSync } from 'pkg-up';
import {
  CosmosPluginConfig,
  FixtureList,
  replaceKeys,
} from 'react-cosmos-core';
import { PlaygroundMountArgs } from 'react-cosmos-ui';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { PlatformType } from '../cosmosPlugin/types.js';
import { findUserModulePaths } from '../userModules/findUserModulePaths.js';
import { importKeyPath } from '../userModules/shared.js';
import { resolveRendererUrl } from './resolveRendererUrl.js';
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
      core: await getCoreConfig(cosmosConfig, true),
      rendererCore: {
        fixtures: getFixtureList(cosmosConfig),
        webRendererUrl: getDevServerWebRendereUrl(platformType, cosmosConfig),
      },
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
      core: await getCoreConfig(cosmosConfig, false),
      rendererCore: {
        fixtures: getFixtureList(cosmosConfig),
        webRendererUrl: getExportWebRendereUrl(cosmosConfig),
      },
    },
    pluginConfigs,
  });
}

async function getCoreConfig(cosmosConfig: CosmosConfig, devServerOn: boolean) {
  const { rootDir, fixturesDir, fixtureFileSuffix } = cosmosConfig;
  return {
    projectId: await getProjectId(rootDir),
    fixturesDir,
    fixtureFileSuffix,
    devServerOn,
  };
}

function getDevServerWebRendereUrl(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
) {
  switch (platformType) {
    case 'native':
      return null;
    case 'web':
      return (
        cosmosConfig.rendererUrl ||
        resolveRendererUrl(cosmosConfig.publicUrl, RENDERER_FILENAME)
      );
    default:
      throw new Error(`Invalid platform type: ${platformType}`);
  }
}

function getExportWebRendereUrl(cosmosConfig: CosmosConfig) {
  // TODO: Allow user to customize renderer URL in static export
  return resolveRendererUrl(cosmosConfig.publicUrl, RENDERER_FILENAME);
}

async function getProjectId(rootDir: string) {
  const pkgPath = pkgUpSync({ cwd: rootDir });
  if (!pkgPath) {
    return rootDir.split(path.sep).pop();
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

function getPlaygroundHtml(playgroundArgs: PlaygroundMountArgs) {
  return replaceKeys(getPlaygroundHtmlTemplate(), {
    __PLAYGROUND_ARGS: JSON.stringify(playgroundArgs),
  });
}

function getPlaygroundHtmlTemplate() {
  return fs.readFileSync(getStaticPath('index.html'), 'utf8');
}

function getFixtureList(cosmosConfig: CosmosConfig) {
  const { fixturePaths } = findUserModulePaths(cosmosConfig);
  return fixturePaths.reduce<FixtureList>(
    (acc, fixturePath) => ({
      ...acc,
      [importKeyPath(fixturePath, cosmosConfig.rootDir)]: { type: 'single' },
    }),
    {}
  );
}
