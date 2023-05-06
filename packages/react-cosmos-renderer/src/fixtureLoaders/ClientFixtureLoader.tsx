import React, { ReactElement } from 'react';
import {
  FixtureId,
  FixtureModules,
  ReactDecorator,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { FixtureModule } from '../fixtureModule/FixtureModule.js';
import { LazyModuleLoader } from '../moduleLoaders/LazyModuleLoader.js';
import { StaticModuleLoader } from '../moduleLoaders/StaticModuleLoader.js';
import { FixtureLoaderConnect } from './FixtureLoaderConnect.js';
import { defaultRenderMessage } from './defaultRenderMessage.js';
import { useFixtureSelection } from './useFixtureSelection.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  globalDecorators?: ReactDecorator[];
  // TODO: Explain the distinction between initialFixtureId and selectedFixtureId
  // initialFixtureId is used with React Native to make the fixture loader tell
  // the Playground auto-select an initial fixture, to be able to use the native
  // with the default fixture without having to load the Playground UI.
  // Can this be achieved with selectedFixtureId only?
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
  const fixtureSelection = useFixtureSelection(
    selectedFixtureId ?? initialFixtureId
  );

  return (
    <FixtureLoaderConnect
      moduleWrappers={moduleWrappers}
      fixtureSelection={fixtureSelection}
      initialFixtureId={initialFixtureId}
      renderMessage={renderMessage}
      renderFixture={selection => {
        function renderModules(modules: FixtureModules) {
          return (
            <FixtureModule
              {...modules}
              {...selection}
              globalDecorators={globalDecorators}
              renderMessage={renderMessage}
            />
          );
        }

        const { fixtureId } = selection;
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
