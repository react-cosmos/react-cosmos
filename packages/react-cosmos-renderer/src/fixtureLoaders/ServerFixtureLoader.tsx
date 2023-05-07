import React, { Suspense } from 'react';
import {
  ReactDecorator,
  StringRendererSearchParams,
  UserModuleWrappers,
  decodeRendererSearchParams,
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
  searchParams: StringRendererSearchParams;
  moduleWrappers: UserModuleWrappers;
  globalDecorators?: ReactDecorator[];
  renderMessage?: (msg: string) => React.ReactElement;
};
export function ServerFixtureLoader({
  searchParams,
  moduleWrappers,
  globalDecorators,
  renderMessage = defaultRenderMessage,
}: Props) {
  const { fixtureId = null } = decodeRendererSearchParams(searchParams);
  const fixtureSelection = fixtureId && {
    fixtureId,
    initialFixtureState: {},
    renderKey: 0,
  };

  return (
    <ServerFixtureChangeListener>
      <FixtureLoaderConnect
        moduleWrappers={moduleWrappers}
        fixtureSelection={fixtureSelection}
        renderMessage={renderMessage}
        renderFixture={(selection, fixtures) => (
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
                  fixtures={fixtures}
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
