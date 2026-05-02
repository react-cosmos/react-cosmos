import React from 'react';
import type {
  ByPath,
  FixtureModules,
  ReactDecoratorWrapper,
  ReactFixtureWrapper,
} from 'react-cosmos-core';
import { getSortedDecoratorsForFixturePath } from 'react-cosmos-core';

type Props = {
  fixtureWrapper: ReactFixtureWrapper;
  decorators: ByPath<ReactDecoratorWrapper>;
  fixturePath: string;
  renderModules: (modules: FixtureModules) => React.ReactElement;
};
export function StaticModuleLoader({
  fixtureWrapper,
  decorators,
  fixturePath,
  renderModules,
}: Props) {
  return renderModules(
    React.useMemo<FixtureModules>(
      () => ({
        fixtureModule: fixtureWrapper.module,
        decoratorModules: getSortedDecoratorsForFixturePath(
          fixturePath,
          decorators
        ).map(d => d.module),
      }),
      [decorators, fixturePath, fixtureWrapper.module]
    )
  );
}
