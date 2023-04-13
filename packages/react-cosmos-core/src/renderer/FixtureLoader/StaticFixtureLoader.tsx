import React, { ReactElement, useMemo } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { FixtureState, SetFixtureState } from '../../fixtureState/types.js';
import { getSortedStaticDecoratorsForFixturePath } from '../getSortedStaticDecoratorsForFixturePath.js';
import {
  ByPath,
  ReactDecorator,
  ReactDecoratorWrapper,
  ReactFixtureWrapper,
} from '../reactTypes.js';
import { DecoratedFixture } from './DecoratedFixture.js';
import { getFixture } from './fixtureHelpers.js';
import { useStaticFixtureModules } from './useStaticFixtureModules.js';

type Props = {
  fixtureWrapper: ReactFixtureWrapper;
  allDecoratorWrappersByPath: ByPath<ReactDecoratorWrapper>;
  systemDecorators: ReactDecorator[];
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderMessage: (msg: string) => ReactElement;
  renderKey: number;
  onErrorReset?: () => unknown;
};
export function StaticFixtureLoader({
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
      getSortedStaticDecoratorsForFixturePath(
        fixtureId.path,
        allDecoratorWrappersByPath
      ),
    [allDecoratorWrappersByPath, fixtureId.path]
  );

  const modules = useStaticFixtureModules(
    fixtureId.path,
    fixtureWrapper,
    decoratorWrappers
  );

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