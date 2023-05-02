import React from 'react';
import {
  FixtureId,
  ReactDecorator,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { AsyncModuleLoader } from '../moduleLoaders/AsyncModuleLoader.js';
import { RendererConnectProvider } from '../rendererConnect/RendererConnectContext.js';
import { SelectedFixture } from '../selectedFixture/SelectedFixture.js';
import { FixtureLoader } from './FixtureLoader.js';

const rendererId = 'fooRendererId';

type Props = {
  moduleWrappers: UserModuleWrappers;
  globalDecorators?: ReactDecorator[];
  selectedFixtureId?: FixtureId | null;
  renderMessage?: (msg: string) => React.ReactElement;
  renderNoFixtureSelected?: boolean;
};
export function ServerFixtureLoader({
  moduleWrappers,
  globalDecorators = [],
  selectedFixtureId = null,
  renderMessage = defaultRenderMessage,
  renderNoFixtureSelected = true,
}: Props) {
  return (
    <RendererConnectProvider rendererId={rendererId}>
      <FixtureLoader
        moduleWrappers={moduleWrappers}
        selectedFixture={
          selectedFixtureId && {
            fixtureId: selectedFixtureId,
            fixtureState: {},
            renderKey: 0,
          }
        }
        renderMessage={renderMessage}
        renderNoFixtureSelected={renderNoFixtureSelected}
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
    </RendererConnectProvider>
  );
}

function defaultRenderMessage(msg: string) {
  return <>{msg}</>;
}
