import React from 'react';
import { getDecoratedFixtureElement } from 'react-cosmos-fixture';
import {
  isMultiFixture,
  ReactDecorator,
  ReactFixtureMap
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

  const decoratorProps = {
    fixtureState: {},
    setFixtureState: () => {},
    onErrorReset: () => {}
  };

  Object.keys(fixtureExportsByPath).forEach(fixturePath => {
    const fixtureExport = fixtureExportsByPath[fixturePath];
    if (isMultiFixture(fixtureExport)) {
      // FIXME: Why does fixtureExport need to be cast as ReactFixtureMap when
      // the type predicate returned by isMultiFixture already ensures it?
      const multiFixtureExport: ReactFixtureMap = fixtureExport;
      Object.keys(fixtureExport).forEach(fixtureName => {
        const fixtureId = { path: fixturePath, name: fixtureName };
        // TODO: Derive decorators from decoratorsByPath
        const decorators: ReactDecorator[] = [];
        fixtures.push({
          fixtureId,
          getElement: () => (
            <>
              {getDecoratedFixtureElement(
                multiFixtureExport[fixtureName],
                decorators,
                decoratorProps
              )}
            </>
          )
        });
      });
    } else {
      const fixtureId = { path: fixturePath, name: null };
      // TODO: Derive decorators from decoratorsByPath
      const decorators: ReactDecorator[] = [];
      fixtures.push({
        fixtureId,
        getElement: () => (
          <>
            {getDecoratedFixtureElement(
              fixtureExport,
              decorators,
              decoratorProps
            )}
          </>
        )
      });
    }
  });

  return fixtures;
}
