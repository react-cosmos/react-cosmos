import type { RendererConfig } from 'react-cosmos-core';
import type { CosmosConfig } from '../cosmosConfig/types.js';
import type { UserModulePaths } from './shared.js';
import { userImportsLazyTemplate } from './userImportsLazyTemplate.js';
import { userImportsTemplate } from './userImportsTemplate.js';

type Args<T extends RendererConfig> = {
  config: CosmosConfig;
  modulePaths: UserModulePaths;
  rendererConfig: T;
  relativeToDir: string | null;
  typeScript: boolean;
};
export function generateUserImports<T extends RendererConfig>({
  config,
  modulePaths,
  rendererConfig,
  relativeToDir,
  typeScript,
}: Args<T>): string {
  const { rootDir, globalImports } = config;

  const template = config.lazy ? userImportsLazyTemplate : userImportsTemplate;

  return template({
    rootDir,
    modulePaths,
    globalImports,
    rendererConfig,
    relativeToDir,
    typeScript,
  });
}
