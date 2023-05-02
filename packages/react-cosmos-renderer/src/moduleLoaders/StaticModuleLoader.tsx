import React from 'react';
import {
  ByPath,
  FixtureModules,
  ReactDecoratorWrapper,
  ReactFixtureWrapper,
  getSortedDecoratorsForFixturePath,
} from 'react-cosmos-core';

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
  const modules = useFixtureModules(fixturePath, fixtureWrapper, decorators);

  return renderModules(modules);
}

function useFixtureModules(
  fixturePath: string,
  fixtureWrapper: ReactFixtureWrapper,
  decoratorWrappers: ByPath<ReactDecoratorWrapper>
) {
  return React.useMemo<FixtureModules>(() => {
    return {
      fixtureModule: fixtureWrapper.module,
      decoratorModules: getSortedDecoratorsForFixturePath(
        fixturePath,
        decoratorWrappers
      ).map(d => d.module),
    };
  }, [decoratorWrappers, fixturePath, fixtureWrapper]);
}
