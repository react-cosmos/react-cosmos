import { useMemo } from 'react';
import {
  ReactDecoratorModule,
  ReactDecoratorWrapper,
  ReactFixtureModule,
  ReactFixtureWrapper,
} from '../reactTypes.js';

type FixtureModules = {
  fixturePath: string;
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
};

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
