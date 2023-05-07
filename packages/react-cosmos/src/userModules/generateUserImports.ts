import { RendererConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { findUserModulePaths } from './findUserModulePaths.js';
import { userImportsLazyTemplate } from './userImportsLazyTemplate.js';
import { userImportsTemplate } from './userImportsTemplate.js';

type Args<T extends RendererConfig> = {
  cosmosConfig: CosmosConfig;
  rendererConfig: T;
  relativeToDir: string | null;
  typeScript: boolean;
};
export function generateUserImports<T extends RendererConfig>({
  cosmosConfig,
  rendererConfig,
  relativeToDir,
  typeScript,
}: Args<T>): string {
  const { rootDir, fixturesDir, fixtureFileSuffix, globalImports, ignore } =
    cosmosConfig;
  const { fixturePaths, decoratorPaths } = findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix,
    ignore,
  });

  const template = cosmosConfig.lazy
    ? userImportsLazyTemplate
    : userImportsTemplate;

  return template({
    globalImports,
    fixturePaths,
    decoratorPaths,
    rendererConfig,
    rootDir,
    relativeToDir,
    typeScript,
  });
}
