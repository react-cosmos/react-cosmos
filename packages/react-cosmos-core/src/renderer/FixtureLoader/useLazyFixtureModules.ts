import { useEffect, useState } from 'react';
import {
  LazyReactDecoratorWrapper,
  LazyReactFixtureWrapper,
  ReactDecoratorModule,
  ReactFixtureModule,
} from '../reactTypes.js';

type FixtureModules = {
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
};

export function useLazyFixtureModules(
  fixtureWrapper: LazyReactFixtureWrapper,
  decoratorWrappers: LazyReactDecoratorWrapper[]
) {
  const [modules, setModules] = useState<FixtureModules | null>(null);

  useEffect(() => {
    let canceled = false;

    (async () => {
      const fixtureModule = await fixtureWrapper.getModule();

      const decoratorModules = await Promise.all(
        decoratorWrappers.map(d => d.getModule())
      );

      if (!canceled) {
        setModules({ fixtureModule, decoratorModules });
      }
    })();

    return () => {
      canceled = true;
    };
  }, [decoratorWrappers, fixtureWrapper]);

  return modules;
}
