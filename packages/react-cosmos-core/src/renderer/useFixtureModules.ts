import { useMemo } from 'react';
import {
  FixtureModules,
  ReactDecoratorWrapper,
  ReactFixtureWrapper,
} from './reactTypes.js';

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
