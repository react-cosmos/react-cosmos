import { mapValues } from 'lodash-es';
import { isValidElement } from 'react';
import {
  ByPath,
  UserModuleWrappers,
  encodeRendererUrlFixture,
} from 'react-cosmos-core';
import { NextCosmosParams } from './nextTypes.js';

type Args = {
  moduleWrappers: UserModuleWrappers;
};
export function nextCosmosStaticParams({ moduleWrappers }: Args) {
  return async () => {
    const modules = await getFixtureModules(moduleWrappers);

    const params: NextCosmosParams[] = [{ fixture: 'index' }];

    for (const fixturePath in modules) {
      const module = modules[fixturePath];

      // FYI: Index routes are required for multi fixtures too in lazy mode,
      // where fixture names are revealed in the Cosmos UI only after a multi
      // fixture is selected.
      params.push({
        fixture: encodeRendererUrlFixture({ path: fixturePath }),
      });

      // We won't be able to "open" Client fixtures, but that's fine because we
      // know they are all single component fixtures.
      if (
        module.default &&
        typeof module.default === 'object' &&
        !isValidElement(module.default)
      ) {
        for (const fixtureName in module.default) {
          params.push({
            fixture: encodeRendererUrlFixture({
              path: fixturePath,
              name: fixtureName,
            }),
          });
        }
      }
    }

    return params;
  };
}

async function getFixtureModules(moduleWrappers: UserModuleWrappers) {
  if (!moduleWrappers.lazy) {
    return mapValues(moduleWrappers.fixtures, f => f.module);
  }

  return await importLazyModules(moduleWrappers.fixtures);
}

async function importLazyModules<T>(
  wrappers: ByPath<{ getModule: () => Promise<T> }>
) {
  return (
    await Promise.all(
      Object.keys(wrappers).map(async pathKey => ({
        pathKey,
        module: await wrappers[pathKey].getModule(),
      }))
    )
  ).reduce(
    (acc: ByPath<T>, { pathKey, module }) => ({ ...acc, [pathKey]: module }),
    {}
  );
}
