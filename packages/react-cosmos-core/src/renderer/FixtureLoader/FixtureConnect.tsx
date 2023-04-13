import React, { ReactElement, useMemo } from 'react';
import { FixtureId } from '../../fixture/types.js';
import {
  ByPath,
  LazyReactDecoratorWrapper,
  LazyReactFixtureWrapper,
  ReactDecorator,
  ReactDecoratorWrapper,
  ReactFixtureWrapper,
} from '../reactTypes.js';
import { RendererConnect } from '../types.js';
import { FixtureStateChangeResponse } from './FixtureStateChangeResponse.js';
import { LazyFixtureLoader } from './LazyFixtureLoader.js';
import { StaticFixtureLoader } from './StaticFixtureLoader.js';
import { useRendererRequest } from './useRendererRequest.js';
import { useRendererResponse } from './useRendererResponse.js';
import { useSelectedFixture } from './useSelectedFixture.js';

type ModuleWrappers =
  | {
      lazy: true;
      fixtures: ByPath<LazyReactFixtureWrapper>;
      decorators: ByPath<LazyReactDecoratorWrapper>;
    }
  | {
      lazy: false;
      fixtures: ByPath<ReactFixtureWrapper>;
      decorators: ByPath<ReactDecoratorWrapper>;
    };

type Props = ModuleWrappers & {
  rendererId: string;
  rendererConnect: RendererConnect;
  systemDecorators: ReactDecorator[];
  initialFixtureId?: FixtureId;
  selectedFixtureId?: null | FixtureId;
  renderMessage?: (msg: string) => ReactElement;
  onErrorReset?: () => unknown;
};
export function FixtureConnect({
  rendererId,
  rendererConnect,
  lazy,
  fixtures,
  decorators,
  systemDecorators,
  initialFixtureId,
  selectedFixtureId,
  onErrorReset,
  renderMessage = defaultRenderMessage,
}: Props) {
  const { selectedFixture, setSelectedFixture, setFixtureState } =
    useSelectedFixture(initialFixtureId, selectedFixtureId);

  // Memoize object and create union type that can be refined by lazy flag
  const fixtureWrappers = useMemo(
    () => (lazy ? { lazy, wrappers: fixtures } : { lazy, wrappers: fixtures }),
    [fixtures, lazy]
  );

  useRendererRequest(
    rendererId,
    rendererConnect,
    fixtureWrappers,
    setSelectedFixture,
    onErrorReset
  );

  useRendererResponse(
    rendererId,
    rendererConnect,
    fixtureWrappers,
    initialFixtureId
  );

  if (!selectedFixture) {
    return renderMessage('No fixture selected.');
  }

  if (!fixtures[selectedFixture.fixtureId.path]) {
    return renderMessage(
      `Fixture path not found: ${selectedFixture.fixtureId.path}`
    );
  }

  const { fixtureId, fixtureState, renderKey } = selectedFixture;
  return (
    <FixtureStateChangeResponse
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      fixtureId={fixtureId}
      fixtureState={fixtureState}
    >
      {lazy ? (
        <LazyFixtureLoader
          fixtureWrapper={fixtures[selectedFixture.fixtureId.path]}
          allDecoratorWrappersByPath={decorators}
          systemDecorators={systemDecorators}
          fixtureId={fixtureId}
          fixtureState={fixtureState}
          setFixtureState={setFixtureState}
          renderMessage={renderMessage}
          renderKey={renderKey}
          onErrorReset={onErrorReset}
        />
      ) : (
        <StaticFixtureLoader
          fixtureWrapper={fixtures[selectedFixture.fixtureId.path]}
          allDecoratorWrappersByPath={decorators}
          systemDecorators={systemDecorators}
          fixtureId={fixtureId}
          fixtureState={fixtureState}
          setFixtureState={setFixtureState}
          renderMessage={renderMessage}
          renderKey={renderKey}
          onErrorReset={onErrorReset}
        />
      )}
    </FixtureStateChangeResponse>
  );
}

function defaultRenderMessage(msg: string) {
  return <>{msg}</>;
}
