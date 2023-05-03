import React from 'react';
import {
  FixtureId,
  ReactDecorator,
  RendererConfig,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { FixtureModule } from '../fixtureModule/FixtureModule.js';
import { AsyncModuleLoader } from '../moduleLoaders/AsyncModuleLoader.js';
import { DomRendererProvider } from '../rendererConnect/DomRendererProvider.js';
import { FixtureLoaderConnect } from './FixtureLoaderConnect.js';
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
  globalDecorators,
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
      <FixtureLoaderConnect
        moduleWrappers={moduleWrappers}
        fixtureSelection={fixtureSelection}
        renderMessage={renderMessage}
        renderFixture={({ fixtureId, renderKey }) => (
          // @ts-expect-error Async Server Component
          <AsyncModuleLoader
            moduleWrappers={moduleWrappers}
            fixturePath={fixtureId.path}
            renderModules={modules => (
              <FixtureModule
                {...modules}
                fixtureId={fixtureId}
                renderKey={renderKey}
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
