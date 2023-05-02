import React, { ReactElement } from 'react';
import {
  FixtureId,
  FixtureModules,
  ReactDecorator,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { LazyModuleLoader } from '../moduleLoaders/LazyModuleLoader.js';
import { StaticModuleLoader } from '../moduleLoaders/StaticModuleLoader.js';
import { SelectedFixture } from '../selectedFixture/SelectedFixture.js';
import { FixtureSelector } from './FixtureSelector.js';
import { defaultRenderMessage } from './defaultRenderMessage.js';
import { useFixtureSelectionConnect } from './useFixtureSelectionConnect.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  globalDecorators: ReactDecorator[];
  initialFixtureId?: FixtureId | null;
  selectedFixtureId?: FixtureId | null;
  renderMessage?: (msg: string) => ReactElement;
};
export function ClientFixtureLoader({
  moduleWrappers,
  globalDecorators,
  initialFixtureId = null,
  selectedFixtureId = null,
  renderMessage = defaultRenderMessage,
}: Props) {
  const fixtureSelection = useFixtureSelectionConnect(
    initialFixtureId,
    selectedFixtureId
  );

  return (
    <FixtureSelector
      moduleWrappers={moduleWrappers}
      fixtureSelection={fixtureSelection}
      initialFixtureId={initialFixtureId}
      renderMessage={renderMessage}
      renderFixture={({ fixtureId, initialFixtureState, renderKey }) => {
        function renderModules(modules: FixtureModules) {
          return (
            <SelectedFixture
              key={renderKey}
              {...modules}
              fixtureId={fixtureId}
              initialFixtureState={initialFixtureState}
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
