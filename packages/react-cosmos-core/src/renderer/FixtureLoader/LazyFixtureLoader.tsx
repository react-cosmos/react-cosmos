import React, { ReactElement, useMemo } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { FixtureState, SetFixtureState } from '../../fixtureState/types.js';
import { getSortedLazyDecoratorsForFixturePath } from '../getSortedLazyDecoratorsForFixturePath.js';
import {
  LazyReactDecoratorWrappersByPath,
  LazyReactFixtureWrapper,
  ReactDecorator,
} from '../reactTypes.js';
import { DecoratedFixture } from './DecoratedFixture.js';
import { getFixture } from './fixtureHelpers.js';
import { useLazyFixtureModules } from './useLazyFixtureModules.js';

type Props = {
  fixtureWrapper: LazyReactFixtureWrapper;
  allDecoratorWrappersByPath: LazyReactDecoratorWrappersByPath;
  systemDecorators: ReactDecorator[];
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderMessage: (msg: string) => ReactElement;
  renderKey: number;
  onErrorReset?: () => unknown;
};
export function LazyFixtureLoader({
  fixtureWrapper,
  allDecoratorWrappersByPath,
  systemDecorators,
  fixtureId,
  fixtureState,
  setFixtureState,
  renderMessage,
  renderKey,
  onErrorReset,
}: Props) {
  const decoratorWrappers = useMemo(
    () =>
      getSortedLazyDecoratorsForFixturePath(
        fixtureId.path,
        allDecoratorWrappersByPath
      ),
    [allDecoratorWrappersByPath, fixtureId.path]
  );

  const modules = useLazyFixtureModules(fixtureWrapper, decoratorWrappers);

  if (!modules) {
    return null;
  }

  const { fixtureModule, decoratorModules } = modules;
  const fixtureExport = fixtureModule.default;
  const fixture = getFixture(fixtureExport, fixtureId.name);

  if (typeof fixture === 'undefined') {
    return renderMessage(`Invalid fixture ID: ${JSON.stringify(fixtureId)}`);
  }

  return (
    <DecoratedFixture
      fixture={fixture}
      systemDecorators={systemDecorators}
      userDecoratorModules={decoratorModules}
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
      renderKey={renderKey}
      onErrorReset={onErrorReset}
    />
  );
}
