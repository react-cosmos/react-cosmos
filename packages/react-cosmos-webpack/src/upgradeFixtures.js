import fs from 'fs';
import path from 'path';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from 'react-cosmos-voyager';
import { addComponentToFixture } from '@skidding/react-cosmos-transforms/lib/addComponentToFixture';

export default function upgradeFixtures(cosmosConfigPath) {
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);

  // TODO: Abort if cosmosConfig.componentPaths is empty

  const { components, fixtures } = getFilePaths(cosmosConfig);

  Object.keys(fixtures).forEach(componentName => {
    Object.keys(fixtures[componentName]).forEach(fixtureName => {
      const fixturePath = fixtures[componentName][fixtureName];
      const componentPathAbs = components[componentName];
      const componentPath = path.relative(
        path.dirname(fixturePath),
        componentPathAbs
      );

      const fixtureCode = fs.readFileSync(fixturePath, 'utf8');
      const newFixtureCode = addComponentToFixture({
        fixtureCode,
        componentPath,
        componentName
      });
      fs.writeFileSync(fixturePath, newFixtureCode, 'utf8');
    });
  });
}
