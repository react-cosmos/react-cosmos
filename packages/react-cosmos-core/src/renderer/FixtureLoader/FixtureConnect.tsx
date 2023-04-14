import React, { ReactElement } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { ReactDecorator, UserModuleWrappers } from '../reactTypes.js';
import { RendererConnect } from '../types.js';
import { FixtureLoader } from './FixtureLoader.js';
import { FixtureStateChangeResponse } from './FixtureStateChangeResponse.js';
import { LazyFixtureLoader } from './LazyFixtureLoader.js';
import { useRendererRequest } from './useRendererRequest.js';
import { useRendererResponse } from './useRendererResponse.js';
import { useSelectedFixture } from './useSelectedFixture.js';

type Props = {
  rendererId: string;
  rendererConnect: RendererConnect;
  moduleWrappers: UserModuleWrappers;
  systemDecorators: ReactDecorator[];
  initialFixtureId?: FixtureId;
  selectedFixtureId?: null | FixtureId;
  renderMessage?: (msg: string) => ReactElement;
  onErrorReset?: () => unknown;
};
export function FixtureConnect({
  rendererId,
  rendererConnect,
  moduleWrappers,
  systemDecorators,
  initialFixtureId,
  selectedFixtureId,
  onErrorReset,
  renderMessage = defaultRenderMessage,
}: Props) {
  const { selectedFixture, setSelectedFixture, setFixtureState } =
    useSelectedFixture(initialFixtureId, selectedFixtureId);

  useRendererRequest(
    rendererId,
    rendererConnect,
    moduleWrappers,
    setSelectedFixture,
    onErrorReset
  );

  useRendererResponse(
    rendererId,
    rendererConnect,
    moduleWrappers,
    initialFixtureId
  );

  if (!selectedFixture) {
    return renderMessage('No fixture selected.');
  }

  const { fixtureId, fixtureState, renderKey } = selectedFixture;

  if (!moduleWrappers.fixtures[fixtureId.path]) {
    return renderMessage(`Fixture path not found: ${fixtureId.path}`);
  }

  return (
    <>
      {moduleWrappers.lazy ? (
        <LazyFixtureLoader
          fixtureWrapper={moduleWrappers.fixtures[fixtureId.path]}
          decorators={moduleWrappers.decorators}
          systemDecorators={systemDecorators}
          fixtureId={fixtureId}
          fixtureState={fixtureState}
          setFixtureState={setFixtureState}
          renderMessage={renderMessage}
          renderKey={renderKey}
          onErrorReset={onErrorReset}
        />
      ) : (
        <FixtureLoader
          fixtureWrapper={moduleWrappers.fixtures[fixtureId.path]}
          decorators={moduleWrappers.decorators}
          systemDecorators={systemDecorators}
          fixtureId={fixtureId}
          fixtureState={fixtureState}
          setFixtureState={setFixtureState}
          renderMessage={renderMessage}
          renderKey={renderKey}
          onErrorReset={onErrorReset}
        />
      )}
      <FixtureStateChangeResponse
        // Reset internal state when fixture ID changes
        key={fixtureIdKey(fixtureId)}
        rendererId={rendererId}
        rendererConnect={rendererConnect}
        fixtureId={fixtureId}
        fixtureState={fixtureState}
      />
    </>
  );
}

function defaultRenderMessage(msg: string) {
  return <>{msg}</>;
}

function fixtureIdKey(fixtureId: FixtureId) {
  return fixtureId.name
    ? [fixtureId.path, fixtureId.name].join('-')
    : fixtureId.path;
}
