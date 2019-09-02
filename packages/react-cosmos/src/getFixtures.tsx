import React from 'react';
import { isMultiFixture } from 'react-cosmos-shared2/react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { CosmosConfig } from './config';
import { getUserModules } from './shared/userDeps';

type Args = {
  cosmosConfig: CosmosConfig;
};

type RenderableFixture = {
  fixtureId: FixtureId;
  getElement: () => React.ReactElement;
};

// TODO: Decorators need to also be taken into consideration for this API
// to be useful. Rendering a fixture without its decorators is invalid. And
// the per-fixture decorator resolution logic is currently kept inside the
// react-cosmos-fixture/FixtureLoader component. An additional data
// structure that maps relevant decorators per fixture path might be useful
// here. Or a higher level API for rendering a fixture by path.
export async function getFixtures({ cosmosConfig }: Args) {
  const { fixtureExportsByPath } = await getUserModules(cosmosConfig);
  const fixtures: RenderableFixture[] = [];

  Object.keys(fixtureExportsByPath).forEach(fixturePath => {
    const fixtureExport = fixtureExportsByPath[fixturePath];
    if (isMultiFixture(fixtureExport)) {
      Object.keys(fixtureExport).forEach(fixtureName => {
        const fixtureId = { path: fixturePath, name: fixtureName };
        fixtures.push({ fixtureId, getElement: () => <>{fixtureExport}</> });
      });
    } else {
      const fixtureId = { path: fixturePath, name: null };
      fixtures.push({ fixtureId, getElement: () => <>{fixtureExport}</> });
    }
  });

  return fixtures;
}
