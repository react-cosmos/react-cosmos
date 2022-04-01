import { CosmosConfig } from '../cosmosConfig/types.js';
import { findUserModulePaths } from './findUserModulePaths.js';
import { Json } from './shared.js';
import { userDepsTemplate } from './userDepsTemplate.js';

type Args = {
  cosmosConfig: CosmosConfig;
  rendererConfig: Json;
  relativeToDir: string | null;
};
export function generateUserDepsModule({
  cosmosConfig,
  rendererConfig,
  relativeToDir,
}: Args): string {
  const { rootDir, fixturesDir, fixtureFileSuffix, globalImports } =
    cosmosConfig;
  const { fixturePaths, decoratorPaths } = findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix,
  });
  return userDepsTemplate({
    globalImports,
    fixturePaths,
    decoratorPaths,
    rendererConfig,
    rootDir,
    relativeToDir,
  });
}
