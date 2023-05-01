import React from 'react';
import {
  FixtureId,
  ReactDecoratorModule,
  ReactFixtureModule,
  getFixtureFromExport,
} from 'react-cosmos-core';
import { DecoratedFixture } from '../shared/DecoratedFixture.js';

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
    <DecoratedFixture
      fixture={fixture}
      systemDecorators={emptyArray}
      userDecoratorModules={decoratorModules}
      fixtureState={emplyObject}
      setFixtureState={noopFunction}
      renderKey={0}
    />
  );
}

const emptyArray: any[] = [];
const emplyObject = {};
const noopFunction = () => {};
