import React, { ReactElement, useMemo } from 'react';
import { DecoratedFixture } from '../client/DecoratedFixture.js';
import { FixtureState, SetFixtureState } from '../shared/fixtureState/types.js';
import { FixtureId } from '../shared/fixtureTypes.js';
import { getFixtureFromExport } from '../shared/getFixtureFromExport.js';
import { getSortedDecoratorsForFixturePath } from '../shared/getSortedDecoratorsForFixturePath.js';
import {
  ByPath,
  FixtureModules,
  ReactDecorator,
  ReactDecoratorWrapper,
  ReactFixtureWrapper,
} from '../shared/userModuleTypes.js';

type Props = {
  fixtureWrapper: ReactFixtureWrapper;
  decorators: ByPath<ReactDecoratorWrapper>;
  systemDecorators: ReactDecorator[];
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderMessage: (msg: string) => ReactElement;
  renderKey: number;
  onErrorReset?: () => unknown;
};
export function FixtureLoader({
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

  const modules = useFixtureModules(
    fixtureId.path,
    fixtureWrapper,
    decoratorWrappers
  );

  const { fixtureModule, decoratorModules } = modules;
  const fixtureExport = fixtureModule.default;
  const fixture = getFixtureFromExport(fixtureExport, fixtureId.name);

  if (typeof fixture === 'undefined') {
    return renderMessage(`Invalid fixture name: ${fixtureId.name}`);
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

function useFixtureModules(
  fixturePath: string,
  fixtureWrapper: ReactFixtureWrapper,
  decoratorWrappers: ReactDecoratorWrapper[]
) {
  return useMemo<FixtureModules>(() => {
    return {
      fixturePath,
      fixtureModule: fixtureWrapper.module,
      decoratorModules: decoratorWrappers.map(d => d.module),
    };
  }, [decoratorWrappers, fixturePath, fixtureWrapper]);
}
