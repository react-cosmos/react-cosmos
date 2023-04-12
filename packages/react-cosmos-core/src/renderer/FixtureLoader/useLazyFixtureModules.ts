import { useEffect, useState } from 'react';
import {
  LazyReactDecoratorWrapper,
  LazyReactFixtureWrapper,
  ReactDecoratorModule,
  ReactFixtureModule,
} from '../reactTypes.js';

type FixtureModules = {
  fixturePath: string;
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
};

export function useLazyFixtureModules(
  fixturePath: string,
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
        setModules({
          fixturePath,
          fixtureModule,
          decoratorModules,
        });
      }
    })();

    return () => {
      canceled = true;
    };
  }, [decoratorWrappers, fixturePath, fixtureWrapper]);

  // Stop returning modules once fixturePath changed to prevent rendering
  // the previous fixture until the new fixture modules are loaded
  return modules && modules.fixturePath === fixturePath ? modules : null;
}
