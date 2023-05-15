import React, { Suspense } from 'react';
import {
  FixtureId,
  ReactDecorator,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { FixtureModule } from '../fixtureModule/FixtureModule.js';
import { AsyncModuleLoader } from '../moduleLoaders/AsyncModuleLoader.js';
import { FixtureLoaderConnect } from './FixtureLoaderConnect.js';
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
  fixtureId: FixtureId | null;
  moduleWrappers: UserModuleWrappers;
  globalDecorators?: ReactDecorator[];
  renderMessage?: (msg: string) => React.ReactElement;
};
export function ServerFixtureLoader({
  fixtureId,
  moduleWrappers,
  globalDecorators,
  renderMessage = defaultRenderMessage,
}: Props) {
  const selectedFixture = fixtureId && {
    fixtureId,
    initialFixtureState: {},
    // Search fixture loader is meant to work with Next.js build-time static
    // generation. Its props will be driven by finite URL segment params and not
    // query strings, which are inherently dynamic. This means we can't receive
    // an incrementing renderKey here. Instead, we'll rely solely on the fixture
    // ID as the fixture render key and will not support refreshing the current
    // fixture by selecting it again.
    renderKey: 0,
  };

  return (
    <FixtureLoaderConnect
      moduleWrappers={moduleWrappers}
      selectedFixture={selectedFixture}
      renderMessage={renderMessage}
      renderFixture={selected => (
        // The suspense boundary allows the rendererReady response to be sent
        // before loading the fixture modules.
        <Suspense>
          {/* @ts-expect-error Async Server Component */}
          <AsyncModuleLoader
            moduleWrappers={moduleWrappers}
            fixturePath={selected.fixtureId.path}
            renderModules={modules => (
              <FixtureModule
                {...modules}
                {...selected}
                globalDecorators={globalDecorators}
                lazy={moduleWrappers.lazy}
                renderMessage={renderMessage}
              />
            )}
          />
        </Suspense>
      )}
    />
  );
}
