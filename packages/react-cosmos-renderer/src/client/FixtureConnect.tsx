import React, { ReactElement } from 'react';
import {
  FixtureId,
  FixtureModules,
  ReactDecorator,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { FixtureLoader } from '../FixtureLoader/FixtureLoader.js';
import { useSelectedFixture } from '../FixtureLoader/useSelectedFixture.js';
import { LazyFixtureModuleLoader } from '../FixtureModuleLoader/LazyFixtureModuleLoader.js';
import { StaticFixtureModuleLoader } from '../FixtureModuleLoader/StaticFixtureModuleLoader.js';
import { SelectedFixture } from '../SelectedFixture/SelectedFixture.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  globalDecorators: ReactDecorator[];
  initialFixtureId?: FixtureId | null;
  selectedFixtureId?: FixtureId | null;
  renderMessage?: (msg: string) => ReactElement;
  renderNoFixtureSelected?: boolean;
};
// TODO: Rename to ClientFixtureLoader
export function FixtureConnect({
  moduleWrappers,
  globalDecorators,
  initialFixtureId = null,
  selectedFixtureId = null,
  renderMessage = defaultRenderMessage,
  renderNoFixtureSelected = true,
}: Props) {
  const state = useSelectedFixture(initialFixtureId, selectedFixtureId);

  return (
    <FixtureLoader
      moduleWrappers={moduleWrappers}
      selectedFixture={state}
      initialFixtureId={initialFixtureId}
      renderMessage={renderMessage}
      renderNoFixtureSelected={renderNoFixtureSelected}
      renderFixture={selectedFixture => {
        const { fixtureId } = selectedFixture;

        function renderModules(modules: FixtureModules) {
          return (
            <SelectedFixture
              {...modules}
              fixtureId={fixtureId}
              initialFixtureState={selectedFixture.fixtureState}
              globalDecorators={globalDecorators}
              renderMessage={renderMessage}
            />
          );
        }

        return moduleWrappers.lazy ? (
          <LazyFixtureModuleLoader
            fixtureWrapper={moduleWrappers.fixtures[fixtureId.path]}
            decorators={moduleWrappers.decorators}
            fixturePath={fixtureId.path}
            renderModules={renderModules}
          />
        ) : (
          <StaticFixtureModuleLoader
            fixtureWrapper={moduleWrappers.fixtures[fixtureId.path]}
            decorators={moduleWrappers.decorators}
            fixturePath={fixtureId.path}
            renderModules={renderModules}
          />
        );
      }}
    />
  );
}

function defaultRenderMessage(msg: string) {
  return <>{msg}</>;
}
