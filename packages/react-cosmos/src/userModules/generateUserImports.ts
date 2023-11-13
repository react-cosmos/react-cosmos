import { RendererConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { UserModulePaths } from './shared.js';
import { userImportsLazyTemplate } from './userImportsLazyTemplate.js';
import { userImportsTemplate } from './userImportsTemplate.js';

type Args<T extends RendererConfig> = {
  cosmosConfig: CosmosConfig;
  modulePaths: UserModulePaths;
  rendererConfig: T;
  relativeToDir: string | null;
  typeScript: boolean;
};
export function generateUserImports<T extends RendererConfig>({
  cosmosConfig,
  modulePaths,
  rendererConfig,
  relativeToDir,
  typeScript,
}: Args<T>): string {
  const { rootDir, globalImports } = cosmosConfig;

  const template = cosmosConfig.lazy
    ? userImportsLazyTemplate
    : userImportsTemplate;

  return template({
    rootDir,
    modulePaths,
    globalImports,
    rendererConfig,
    relativeToDir,
    typeScript,
  });
}
