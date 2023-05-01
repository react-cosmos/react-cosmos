import React from 'react';
import {
  FixtureId,
  ReactDecoratorModule,
  ReactFixtureModule,
  getFixtureFromExport,
} from 'react-cosmos-core';
import { FixtureContextProvider } from '../shared/FixtureContextProvider.js';
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
    <FixtureContextProvider
      fixtureState={emplyObject}
      setFixtureState={noopFunction}
      renderKey={0}
    >
      {decorateFixture(
        createFixtureNode(fixture),
        decoratorModules.map(m => m.default),
        {
          fixtureState: emplyObject,
          setFixtureState: noopFunction,
          onErrorReset: noopFunction,
        }
      )}
    </FixtureContextProvider>
  );
}

const emplyObject = {};
const noopFunction = () => {};
