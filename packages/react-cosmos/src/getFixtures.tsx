import React from 'react';
import { getDecoratedFixtureElement } from 'react-cosmos-fixture';
import {
  isMultiFixture,
  ReactDecorator,
  ReactFixtureMap,
  ReactFixture
} from 'react-cosmos-shared2/react';
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

export async function getFixtures({ cosmosConfig }: Args) {
  const { fixtureExportsByPath } = await getUserModules(cosmosConfig);

  const fixtures: RenderableFixture[] = [];
  Object.keys(fixtureExportsByPath).forEach(fixturePath => {
    const fixtureExport = fixtureExportsByPath[fixturePath];
    if (isMultiFixture(fixtureExport)) {
      // FIXME: Why does fixtureExport need to be cast as ReactFixtureMap when
      // the type predicate returned by isMultiFixture already ensures it?
      const multiFixtureExport: ReactFixtureMap = fixtureExport;
      Object.keys(fixtureExport).forEach(fixtureName => {
        const fixtureId = { path: fixturePath, name: fixtureName };
        fixtures.push({
          fixtureId,
          getElement: createFixtureElementGetter(
            multiFixtureExport[fixtureName]
          )
        });
      });
    } else {
      const fixtureId = { path: fixturePath, name: null };
      fixtures.push({
        fixtureId,
        getElement: createFixtureElementGetter(fixtureExport)
      });
    }
  });

  return fixtures;
}

function createFixtureElementGetter(
  fixture: ReactFixture
): () => React.ReactElement {
  // TODO: Derive decorators from decoratorsByPath
  const decorators: ReactDecorator[] = [];
  const decoratorProps = {
    fixtureState: {},
    setFixtureState: () => {},
    onErrorReset: () => {}
  };

  return () => (
    <>{getDecoratedFixtureElement(fixture, decorators, decoratorProps)}</>
  );
}
