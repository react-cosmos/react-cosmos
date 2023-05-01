import { useEffect, useState } from 'react';
import {
  FixtureModules,
  LazyReactDecoratorWrapper,
  LazyReactFixtureWrapper,
} from 'react-cosmos-core';
import { importLazyFixtureModules } from '../shared/importLazyFixtureModules.js';

export function useLazyFixtureModules(
  fixturePath: string,
  fixtureWrapper: LazyReactFixtureWrapper,
  decoratorWrappers: LazyReactDecoratorWrapper[]
) {
  const [modules, setModules] = useState<FixtureModules | null>(null);

  useEffect(() => {
    let canceled = false;

    (async () => {
      const { fixtureModule, decoratorModules } =
        await importLazyFixtureModules(fixtureWrapper, decoratorWrappers);

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
