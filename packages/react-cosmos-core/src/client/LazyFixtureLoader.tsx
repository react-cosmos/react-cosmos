import React, { ReactElement, useMemo } from 'react';
import { FixtureState, SetFixtureState } from '../shared/fixtureState/types.js';
import { FixtureId } from '../shared/fixtureTypes.js';
import { getFixtureFromExport } from '../shared/getFixtureFromExport.js';
import { getSortedDecoratorsForFixturePath } from '../shared/getSortedDecoratorsForFixturePath.js';
import { RendererConnect } from '../shared/rendererConnectTypes.js';
import {
  ByPath,
  LazyReactDecoratorWrapper,
  LazyReactFixtureWrapper,
  ReactDecorator,
} from '../shared/userModuleTypes.js';
import { DecoratedFixture } from './DecoratedFixture.js';
import { LazyFixtureListItemUpdate } from './LazyFixtureListItemUpdate.js';
import { useLazyFixtureModules } from './useLazyFixtureModules.js';

type Props = {
  rendererId: string;
  rendererConnect: RendererConnect;
  fixtureWrapper: LazyReactFixtureWrapper;
  decorators: ByPath<LazyReactDecoratorWrapper>;
  systemDecorators: ReactDecorator[];
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderMessage: (msg: string) => ReactElement;
  renderKey: number;
  onErrorReset?: () => unknown;
};
export function LazyFixtureLoader({
  rendererId,
  rendererConnect,
  fixtureWrapper,
  decorators,
  systemDecorators,
  fixtureId,
  fixtureState,
  setFixtureState,
  renderMessage,
  renderKey,
  onErrorReset,
}: Props) {
  const decoratorWrappers = useMemo(
    () => getSortedDecoratorsForFixturePath(fixtureId.path, decorators),
    [decorators, fixtureId.path]
  );

  const modules = useLazyFixtureModules(
    fixtureId.path,
    fixtureWrapper,
    decoratorWrappers
  );

  if (!modules) {
    return null;
  }

  const { fixtureModule, decoratorModules } = modules;
  const fixtureExport = fixtureModule.default;
  const fixture = getFixtureFromExport(fixtureExport, fixtureId.name);

  if (typeof fixture === 'undefined') {
    return renderMessage(`Invalid fixture name: ${fixtureId.name}`);
  }

  return (
    <>
      <DecoratedFixture
        fixture={fixture}
        systemDecorators={systemDecorators}
        userDecoratorModules={decoratorModules}
        fixtureState={fixtureState}
        setFixtureState={setFixtureState}
        renderKey={renderKey}
        onErrorReset={onErrorReset}
      />
      <LazyFixtureListItemUpdate
        rendererId={rendererId}
        rendererConnect={rendererConnect}
        fixturePath={fixtureId.path}
        fixtureModule={fixtureModule}
      />
    </>
  );
}
