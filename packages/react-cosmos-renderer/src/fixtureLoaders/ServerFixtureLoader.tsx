import React, { Suspense } from 'react';
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

// This fixture loader is designed for React Server Components setups.
// Although server components are stateless, this fixture loader still
// communicates with the Cosmos UI through Client components (via postMessage
// or WebSocket messages). The main distinction from the client fixture loader
// is that the fixture modules here are loaded on the server. This means that
// the fixture loader cannot receive fixtureSelect messages from the Cosmos UI.
// The fixture is selected on the server and a full page reload is required to
// change the fixture.
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
        renderFixture={selection => (
          // The suspense boundary allows the rendererReady response to be sent
          // before loading the fixture modules.
          <Suspense>
            {/* @ts-expect-error Async Server Component */}
            <AsyncModuleLoader
              moduleWrappers={moduleWrappers}
              fixturePath={selection.fixtureId.path}
              renderModules={modules => (
                <FixtureModule
                  {...modules}
                  {...selection}
                  globalDecorators={globalDecorators}
                  renderMessage={renderMessage}
                />
              )}
            />
          </Suspense>
        )}
      />
    </DomRendererProvider>
  );
}
