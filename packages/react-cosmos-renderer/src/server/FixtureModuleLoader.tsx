import React from 'react';
import {
  FixtureId,
  ReactDecoratorModule,
  ReactFixtureModule,
  getFixtureFromExport,
} from 'react-cosmos-core';
import { getFixtureElement } from '../shared/getFixtureElement.js';

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

  return <>{getFixtureElement(fixture)}</>;
}
