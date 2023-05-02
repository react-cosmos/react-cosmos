import React from 'react';
import {
  FixtureId,
  FixtureState,
  ReactDecorator,
  ReactDecoratorModule,
  ReactFixtureModule,
  getFixtureFromExport,
  getFixtureItemFromExport,
} from 'react-cosmos-core';
import { DecoratedFixture } from './DecoratedFixture.js';
import { SelectedFixtureProvider } from './SelectedFixtureProvider.js';

type Props = {
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
  globalDecorators: ReactDecorator[];
  fixtureId: FixtureId;
  initialFixtureState?: FixtureState;
  renderMessage: (msg: string) => React.ReactElement;
};
export function SelectedFixture({
  fixtureModule,
  decoratorModules,
  globalDecorators,
  fixtureId,
  initialFixtureState,
  renderMessage,
}: Props) {
  const fixtureItem = React.useMemo(
    () => getFixtureItemFromExport(fixtureModule.default),
    [fixtureModule.default]
  );

  const fixture = getFixtureFromExport(fixtureModule.default, fixtureId.name);

  if (typeof fixture === 'undefined') {
    return renderMessage(`Invalid fixture name: ${fixtureId.name}`);
  }

  return (
    <SelectedFixtureProvider
      fixtureId={fixtureId}
      initialFixtureState={initialFixtureState}
      fixtureItem={fixtureItem}
    >
      <DecoratedFixture
        fixture={fixture}
        userDecoratorModules={decoratorModules}
        globalDecorators={globalDecorators}
      />
    </SelectedFixtureProvider>
  );
}
