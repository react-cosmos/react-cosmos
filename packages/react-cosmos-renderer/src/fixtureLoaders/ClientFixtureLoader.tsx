'use client';
import React, { ReactElement } from 'react';
import {
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
  renderMessage?: (msg: string) => ReactElement;
};
export function ClientFixtureLoader({
  moduleWrappers,
  globalDecorators,
  renderMessage = defaultRenderMessage,
}: Props) {
  const fixtureSelection = useFixtureSelection();

  return (
    <FixtureLoaderConnect
      moduleWrappers={moduleWrappers}
      fixtureSelection={fixtureSelection}
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
