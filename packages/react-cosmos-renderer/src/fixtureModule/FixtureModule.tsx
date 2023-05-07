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
import { FixtureProvider } from './FixtureProvider.js';

type Props = {
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
  globalDecorators?: ReactDecorator[];
  fixtureId: FixtureId;
  initialFixtureState?: FixtureState;
  renderKey: number;
  lazy: boolean;
  renderMessage: (msg: string) => React.ReactElement;
};
export function FixtureModule({
  fixtureModule,
  decoratorModules,
  globalDecorators,
  fixtureId,
  initialFixtureState,
  renderKey,
  lazy,
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
    <FixtureProvider
      key={renderKey}
      fixtureId={fixtureId}
      initialFixtureState={initialFixtureState}
      fixtureItem={fixtureItem}
      lazy={lazy}
    >
      <DecoratedFixture
        fixture={fixture}
        userDecoratorModules={decoratorModules}
        globalDecorators={globalDecorators}
      />
    </FixtureProvider>
  );
}
