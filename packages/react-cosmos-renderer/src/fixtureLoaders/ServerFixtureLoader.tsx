import React from 'react';
import {
  FixtureId,
  ReactDecorator,
  RendererConfig,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { AsyncModuleLoader } from '../moduleLoaders/AsyncModuleLoader.js';
import { DomRendererProvider } from '../rendererConnect/DomRendererProvider.js';
import { SelectedFixture } from '../selectedFixture/SelectedFixture.js';
import { FixtureSelector } from './FixtureSelector.js';
import { defaultRenderMessage } from './defaultRenderMessage.js';

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  globalDecorators?: ReactDecorator[];
  selectedFixtureId?: FixtureId | null;
  renderMessage?: (msg: string) => React.ReactElement;
};
export function ServerFixtureLoader({
  rendererConfig,
  moduleWrappers,
  globalDecorators = [],
  selectedFixtureId = null,
  renderMessage = defaultRenderMessage,
}: Props) {
  const fixtureSelection = selectedFixtureId && {
    fixtureId: selectedFixtureId,
    initialFixtureState: {},
    renderKey: 0,
  };

  return (
    <DomRendererProvider playgroundUrl={rendererConfig.playgroundUrl}>
      <FixtureSelector
        moduleWrappers={moduleWrappers}
        fixtureSelection={fixtureSelection}
        renderMessage={renderMessage}
        renderFixture={({ fixtureId }) => (
          // @ts-expect-error Async Server Component
          <AsyncModuleLoader
            moduleWrappers={moduleWrappers}
            fixturePath={fixtureId.path}
            renderModules={modules => (
              <SelectedFixture
                {...modules}
                fixtureId={fixtureId}
                globalDecorators={globalDecorators}
                renderMessage={renderMessage}
              />
            )}
          />
        )}
      />
    </DomRendererProvider>
  );
}
