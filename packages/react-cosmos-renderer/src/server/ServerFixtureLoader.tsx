import React from 'react';
import {
  FixtureId,
  UserModuleWrappers,
  getSortedDecoratorsForFixturePath,
} from 'react-cosmos-core';
import { importLazyFixtureModules } from '../shared/importLazyFixtureModules.js';
import { FixtureModuleLoader } from './FixtureModuleLoader.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  fixtureId?: FixtureId;
  renderNoFixtureSelected?: boolean;
};
export async function ServerFixtureLoader({
  moduleWrappers,
  fixtureId,
  renderNoFixtureSelected = true,
}: Props) {
  if (!fixtureId) {
    return renderNoFixtureSelected ? 'No fixture selected.' : null;
  }

  if (!moduleWrappers.fixtures[fixtureId.path]) {
    return `Fixture path not found: ${fixtureId.path}`;
  }

  if (moduleWrappers.lazy) {
    const { fixtureModule, decoratorModules } = await importLazyFixtureModules(
      moduleWrappers.fixtures[fixtureId.path],
      getSortedDecoratorsForFixturePath(
        fixtureId.path,
        moduleWrappers.decorators
      )
    );

    return (
      <FixtureModuleLoader
        fixtureId={fixtureId}
        fixtureModule={fixtureModule}
        decoratorModules={decoratorModules}
      />
    );
  }

  return (
    <FixtureModuleLoader
      fixtureId={fixtureId}
      fixtureModule={moduleWrappers.fixtures[fixtureId.path].module}
      decoratorModules={getSortedDecoratorsForFixturePath(
        fixtureId.path,
        moduleWrappers.decorators
      ).map(d => d.module)}
    />
  );
}
