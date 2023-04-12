import { FixtureList, FixtureListItem } from '../fixture/types.js';
import { isMultiFixture } from './isMultiFixture.js';
import {
  LazyReactFixtureWrappersByPath,
  ReactFixtureExport,
  ReactFixtureExports,
  ReactFixtureWrapper,
  ReactFixtureWrappers,
} from './reactTypes.js';

export function getFixtureListFromLazyWrappers(
  wrappers: LazyReactFixtureWrappersByPath
) {
  return Object.keys(wrappers).reduce((acc: FixtureList, fixturePath) => {
    return { ...acc, [fixturePath]: { type: 'single' } as FixtureListItem };
  }, {});
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
