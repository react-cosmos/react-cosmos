import { FixtureList, FixtureListItem } from '../fixture/types.js';
import { isMultiFixture } from './isMultiFixture.js';
import {
  ReactFixtureExport,
  ReactFixtureExports,
  ReactFixtureWrapper,
  ReactFixtureWrappers,
  UserModuleWrappers,
} from './reactTypes.js';

export function getFixtureListFromWrappersNew(wrappers: UserModuleWrappers) {
  return Object.keys(wrappers.fixtures).reduce<FixtureList>(
    (acc, fixturePath) => {
      return {
        ...acc,
        [fixturePath]: wrappers.lazy
          ? { type: 'single' }
          : getItemFromWrapper(wrappers.fixtures[fixturePath]),
      };
    },
    {}
  );
}

export function getFixtureListFromWrappers(wrappers: ReactFixtureWrappers) {
  return Object.keys(wrappers).reduce((acc: FixtureList, fixturePath) => {
    return { ...acc, [fixturePath]: getItemFromWrapper(wrappers[fixturePath]) };
  }, {});
}

export function getFixtureListFromExports(exports: ReactFixtureExports) {
  return Object.keys(exports).reduce((acc: FixtureList, fixturePath) => {
    return { ...acc, [fixturePath]: getItemFromExport(exports[fixturePath]) };
  }, {});
}

function getItemFromWrapper(wrapper: ReactFixtureWrapper): FixtureListItem {
  return getItemFromExport(wrapper.module.default);
}

function getItemFromExport(fixtureExport: ReactFixtureExport): FixtureListItem {
  return isMultiFixture(fixtureExport)
    ? { type: 'multi', fixtureNames: Object.keys(fixtureExport) }
    : { type: 'single' };
}
