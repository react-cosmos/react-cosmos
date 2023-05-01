import React from 'react';
import {
  FixtureId,
  ReactDecoratorModule,
  ReactDecoratorProps,
  ReactFixtureModule,
  getFixtureFromExport,
} from 'react-cosmos-core';
import { decorateFixture } from '../shared/decorateFixture.js';
import { createFixtureNode } from '../shared/fixtureNode.js';

type Props = {
  fixtureId: FixtureId;
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
};
export function FixtureModuleLoader({
  fixtureId,
  fixtureModule,
  decoratorModules,
}: Props) {
  const fixture = getFixtureFromExport(fixtureModule.default, fixtureId.name);

  if (typeof fixture === 'undefined') {
    return <>Invalid fixture name: {fixtureId.name}</>;
  }

  return (
    <>
      {decorateFixture(
        createFixtureNode(fixture),
        decoratorModules.map(m => m.default),
        noopDecoratorProps
      )}
    </>
  );
}

const noopDecoratorProps: Omit<ReactDecoratorProps, 'children'> = {
  fixtureState: {},
  setFixtureState: () => {},
  onErrorReset: () => {},
};
