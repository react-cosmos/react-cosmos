import { FixtureList, FixtureListItem } from '../fixture/types.js';
import { isMultiFixture } from './isMultiFixture.js';
import {
  ByPath,
  ReactFixtureExport,
  ReactFixtureWrapper,
  UserModuleWrappers,
} from './reactTypes.js';

export function getFixtureListFromWrappers(wrappers: UserModuleWrappers) {
  return Object.keys(wrappers.fixtures).reduce<FixtureList>(
    (acc, fixturePath) => {
      return {
        ...acc,
        [fixturePath]: wrappers.lazy
          ? { type: 'single' }
          : getFixtureItemFromWrapper(wrappers.fixtures[fixturePath]),
      };
    },
    {}
  );
}

export function getFixtureListFromExports(exports: ByPath<ReactFixtureExport>) {
  return Object.keys(exports).reduce((acc: FixtureList, fixturePath) => {
    return {
      ...acc,
      [fixturePath]: getFixtureItemFromExport(exports[fixturePath]),
    };
  }, {});
}

function getFixtureItemFromWrapper(
  wrapper: ReactFixtureWrapper
): FixtureListItem {
  return getFixtureItemFromExport(wrapper.module.default);
}

export function getFixtureItemFromExport(
  fixtureExport: ReactFixtureExport
): FixtureListItem {
  return isMultiFixture(fixtureExport)
    ? { type: 'multi', fixtureNames: Object.keys(fixtureExport) }
    : { type: 'single' };
}
