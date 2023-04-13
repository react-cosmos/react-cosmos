import { useMemo } from 'react';
import { ReactDecoratorWrapper, ReactFixtureWrapper } from '../reactTypes.js';
import { FixtureModules } from './types.js';

export function useFixtureModules(
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
