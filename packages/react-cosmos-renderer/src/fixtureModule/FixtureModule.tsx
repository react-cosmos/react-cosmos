import React from 'react';
import {
  FixtureId,
  FixtureState,
  ReactDecorator,
  ReactDecoratorModule,
  ReactFixtureModule,
  getFixtureFromExport,
  getFixtureItemFromExport,
  pickSerializableValues,
  stringifyFixtureId,
} from 'react-cosmos-core';
import { DecoratedFixture } from './DecoratedFixture.js';
import { FixtureProvider } from './FixtureProvider.js';

type Props = {
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
  globalDecorators?: ReactDecorator[];
  fixtureId: FixtureId;
  // fixtureParams: FixtureParams;
  // setFixtureParams: (params: FixtureParams) => void;
  initialFixtureState?: FixtureState;
  renderKey: number;
  lazy: boolean;
  renderMessage: (msg: string) => React.ReactNode;
};
export function FixtureModule({
  fixtureModule,
  decoratorModules,
  globalDecorators,
  fixtureId,
  // fixtureParams,
  // setFixtureParams,
  initialFixtureState,
  renderKey,
  lazy,
  renderMessage,
}: Props) {
  const fixtureItem = React.useMemo(
    () => getFixtureItemFromExport(fixtureModule.default),
    [fixtureModule.default]
  );

  const fixtureKey = React.useMemo(
    () => `${stringifyFixtureId(fixtureId)}-${renderKey}`,
    [fixtureId, renderKey]
  );

  const fixture = getFixtureFromExport(fixtureModule.default, fixtureId.name);

  const { options = {} } = fixtureModule;
  const serializableOptions = React.useMemo(
    () => pickSerializableValues(options),
    [options]
  );

  if (typeof fixture === 'undefined') {
    return renderMessage(`Invalid fixture name: ${fixtureId.name}`);
  }

  return (
    <FixtureProvider
      key={fixtureKey}
      fixtureId={fixtureId}
      // fixtureParams={fixtureParams}
      // setFixtureParams={setFixtureParams}
      initialFixtureState={initialFixtureState}
      fixtureItem={fixtureItem}
      fixtureOptions={serializableOptions}
      lazy={lazy}
    >
      <DecoratedFixture
        fixture={fixture}
        fixtureOptions={options}
        userDecoratorModules={decoratorModules}
        globalDecorators={globalDecorators}
      />
    </FixtureProvider>
  );
}
