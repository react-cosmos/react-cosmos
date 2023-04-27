import { CosmosConfig } from '../cosmosConfig/types.js';
import { Json } from '../utils/json.js';
import { findUserModulePaths } from './findUserModulePaths.js';
import { userImportsLazyTemplate } from './userImportsLazyTemplate.js';
import { userImportsTemplate } from './userImportsTemplate.js';

type Args = {
  cosmosConfig: CosmosConfig;
  rendererConfig: Json;
  relativeToDir: string | null;
  typeScript: boolean;
};
export function generateUserImports({
  cosmosConfig,
  rendererConfig,
  relativeToDir,
  typeScript,
}: Args): string {
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
