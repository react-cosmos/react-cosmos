import React, { ReactElement } from 'react';
import {
  FixtureId,
  FixtureModules,
  ReactDecorator,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { LazyModuleLoader } from '../moduleLoaders/LazyModuleLoader.js';
import { StaticModuleLoader } from '../moduleLoaders/StaticModuleLoader.js';
import { SelectedFixture } from '../selectedFixture2/SelectedFixture.js';
import { FixtureLoaderLink } from './FixtureLoaderLink.js';
import { useSelectedFixture } from './useSelectedFixture.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  globalDecorators: ReactDecorator[];
  initialFixtureId?: FixtureId | null;
  selectedFixtureId?: FixtureId | null;
  renderMessage?: (msg: string) => ReactElement;
  renderNoFixtureSelected?: boolean;
};
export function ClientFixtureLoader({
  moduleWrappers,
  globalDecorators,
  initialFixtureId = null,
  selectedFixtureId = null,
  renderMessage = defaultRenderMessage,
  renderNoFixtureSelected = true,
}: Props) {
  const state = useSelectedFixture(initialFixtureId, selectedFixtureId);

  return (
    <FixtureLoaderLink
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
          <LazyModuleLoader
            fixtureWrapper={moduleWrappers.fixtures[fixtureId.path]}
            decorators={moduleWrappers.decorators}
            fixturePath={fixtureId.path}
            renderModules={renderModules}
          />
        ) : (
          <StaticModuleLoader
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
