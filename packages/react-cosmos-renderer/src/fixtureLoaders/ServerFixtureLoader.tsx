import React, { Suspense } from 'react';
import {
  ReactDecorator,
  RendererParams,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { FixtureModule } from '../fixtureModule/FixtureModule.js';
import { AsyncModuleLoader } from '../moduleLoaders/AsyncModuleLoader.js';
import { FixtureLoaderConnect } from './FixtureLoaderConnect.js';
import { ServerFixtureChangeListener } from './ServerFixtureChangeListener.js';
import { defaultRenderMessage } from './defaultRenderMessage.js';

// This fixture loader is designed for React Server Components setups.
// Although server components are stateless, this fixture loader still
// communicates with the Cosmos UI through Client components via postMessage
// or WebSocket messages. The main distinction from the client fixture loader
// is that the fixture modules here are loaded on the server. This means that
// this fixture loader cannot respond directly to 'fixtureSelect' client
// requests. Instead, here the fixture is selected from the server-side HTTP
// request search params. Fixture change requests are then received on the
// client, which triggers a page reload by changing the URL's search params,
// which in turn triggers a new fixture selection on the server.
type Props = {
  params: RendererParams;
  moduleWrappers: UserModuleWrappers;
  globalDecorators?: ReactDecorator[];
  renderMessage?: (msg: string) => React.ReactElement;
};
export function ServerFixtureLoader({
  params,
  moduleWrappers,
  globalDecorators,
  renderMessage = defaultRenderMessage,
}: Props) {
  const { fixtureId = null, key = 0 } = params;

  const fixtureSelection = fixtureId && {
    fixtureId,
    initialFixtureState: {},
    renderKey: key,
  };

  return (
    <ServerFixtureChangeListener>
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
                  lazy={moduleWrappers.lazy}
                  renderMessage={renderMessage}
                />
              )}
            />
          </Suspense>
        )}
      />
    </ServerFixtureChangeListener>
  );
}
