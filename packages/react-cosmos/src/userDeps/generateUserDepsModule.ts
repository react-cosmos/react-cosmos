import { CosmosConfig } from '../config/shared';
import { findUserModulePaths } from './findUserModulePaths';
import { Json } from './shared';
import { userDepsTemplate } from './userDepsTemplate';

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
