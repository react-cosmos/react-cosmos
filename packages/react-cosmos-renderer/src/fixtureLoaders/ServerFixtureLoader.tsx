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
import { ServerFixtureChangeListener } from './ServerFixtureChangeListener.js';
import { defaultRenderMessage } from './defaultRenderMessage.js';

// This fixture loader is designed for React Server Components setups.
// Although server components are stateless, this fixture loader still
// communicates with the Cosmos UI through Client components (via postMessage
// or WebSocket messages). The main distinction from the client fixture loader
// is that the fixture modules here are loaded on the server. This means that
// the fixture loader cannot receive fixtureSelect messages from the Cosmos UI.
// The fixture is selected on the server and a full page reload is required to
// change the fixture.

// Example usage (src/app/cosmos/page.tsx):
// import { parseRendererUrlQuery } from 'react-cosmos-core';
// import { ServerFixtureLoader } from 'react-cosmos-renderer';
// import { moduleWrappers, rendererConfig } from '../../../cosmos.imports';

// export default ({ searchParams }: { searchParams: string }) => {
//   return (
//     <ServerFixtureLoader
//       rendererConfig={rendererConfig}
//       moduleWrappers={moduleWrappers}
//       selectedFixtureId={parseRendererUrlQuery(searchParams).fixtureId}
//     />
//   );
// };

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  globalDecorators?: ReactDecorator[];
  // TODO: Receive all renderer query params
  selectedFixtureId?: FixtureId | null;
  locked?: boolean;
  renderMessage?: (msg: string) => React.ReactElement;
};
export function ServerFixtureLoader({
  rendererConfig,
  moduleWrappers,
  globalDecorators,
  selectedFixtureId = null,
  locked = false,
  renderMessage = defaultRenderMessage,
}: Props) {
  const fixtureSelection = selectedFixtureId && {
    fixtureId: selectedFixtureId,
    initialFixtureState: {},
    renderKey: 0,
  };

  return (
    <DomRendererProvider
      rendererConfig={rendererConfig}
      onQueryParams={queryParams => {
        // TODO: Actually implement this outside (in Next);
        console.log('Not implemented: onQueryParams', queryParams);
      }}
    >
      <ServerFixtureChangeListener
        selectedFixtureId={selectedFixtureId}
        locked={locked}
      >
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
      </ServerFixtureChangeListener>
    </DomRendererProvider>
  );
}
