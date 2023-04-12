import React, { ReactElement, useState } from 'react';
import { FixtureId } from '../../fixture/types.js';
import {
  LazyReactDecoratorWrappersByPath,
  LazyReactFixtureWrappersByPath,
  ReactDecorator,
} from '../reactTypes.js';
import { RendererConnect } from '../types.js';
import { FixtureStateChangeResponse } from './FixtureStateChangeResponse.js';
import { LazyFixtureLoader } from './LazyFixtureLoader.js';
import { useRendererRequest } from './useRendererRequest.js';
import { useRendererResponse } from './useRendererResponse.js';
import { useSelectedFixture } from './useSelectedFixture.js';

type Props = {
  rendererId: string;
  rendererConnect: RendererConnect;
  fixtures: LazyReactFixtureWrappersByPath;
  decorators: LazyReactDecoratorWrappersByPath;
  systemDecorators: ReactDecorator[];
  initialFixtureId?: FixtureId;
  selectedFixtureId?: null | FixtureId;
  renderMessage?: (msg: string) => ReactElement;
  onErrorReset?: () => unknown;
};
export function FixtureConnect({
  rendererId,
  rendererConnect,
  fixtures,
  decorators,
  systemDecorators,
  initialFixtureId,
  selectedFixtureId,
  onErrorReset,
  renderMessage = defaultRenderMessage,
}: Props) {
  const [renderKey, setRenderKey] = useState(0);

  const { selectedFixture, setSelectedFixture, setFixtureState } =
    useSelectedFixture(initialFixtureId, selectedFixtureId);

  useRendererRequest(
    rendererId,
    rendererConnect,
    fixtures,
    setSelectedFixture,
    setRenderKey,
    onErrorReset
  );

  useRendererResponse(rendererId, rendererConnect, fixtures, initialFixtureId);

  if (!selectedFixture) {
    return renderMessage('No fixture selected.');
  }

  const fixtureWrapper = fixtures[selectedFixture.fixtureId.path];
  if (!fixtureWrapper) {
    return renderMessage(
      `Invalid fixture path: ${selectedFixture.fixtureId.path}`
    );
  }

  const { fixtureId, fixtureState } = selectedFixture;
  return (
    <FixtureStateChangeResponse
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      fixtureId={fixtureId}
      fixtureState={fixtureState}
    >
      <LazyFixtureLoader
        fixtureWrapper={fixtureWrapper}
        allDecoratorWrappersByPath={decorators}
        systemDecorators={systemDecorators}
        fixtureId={fixtureId}
        fixtureState={fixtureState}
        setFixtureState={setFixtureState}
        renderMessage={renderMessage}
        renderKey={renderKey}
        onErrorReset={onErrorReset}
      />
    </FixtureStateChangeResponse>
  );
}

function defaultRenderMessage(msg: string) {
  return <>{msg}</>;
}
