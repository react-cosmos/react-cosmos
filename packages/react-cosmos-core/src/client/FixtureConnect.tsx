import React, { ReactElement } from 'react';
import { RendererConnect } from '../renderer/rendererConnectTypes.js';
import { FixtureId } from '../shared/fixtureTypes.js';
import {
  ReactDecorator,
  UserModuleWrappers,
} from '../shared/userModuleTypes.js';
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
  renderNoFixtureSelected?: boolean;
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
  renderNoFixtureSelected = true,
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
    return renderNoFixtureSelected
      ? renderMessage('No fixture selected.')
      : null;
  }

  const { fixtureId, fixtureState, renderKey } = selectedFixture;

  if (!moduleWrappers.fixtures[fixtureId.path]) {
    return renderMessage(`Fixture path not found: ${fixtureId.path}`);
  }

  return (
    <>
      {moduleWrappers.lazy ? (
        <LazyFixtureLoader
          rendererId={rendererId}
          rendererConnect={rendererConnect}
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
        rendererId={rendererId}
        rendererConnect={rendererConnect}
        selectedFixture={selectedFixture}
        setSelectedFixture={setSelectedFixture}
      />
    </>
  );
}

function defaultRenderMessage(msg: string) {
  return <>{msg}</>;
}
