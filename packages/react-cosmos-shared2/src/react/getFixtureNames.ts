import { FixtureNamesByPath } from '../renderer';
import { ReactFixturesByPath } from './shared';
import { isMultiFixture } from './isMultiFixture';

export function getFixtureNames(
  fixtures: ReactFixturesByPath
): FixtureNamesByPath {
  const fixtureNamesByPath: FixtureNamesByPath = {};
  Object.keys(fixtures).forEach(fixturePath => {
    const fixtureExport = fixtures[fixturePath];
    fixtureNamesByPath[fixturePath] = isMultiFixture(fixtureExport)
      ? Object.keys(fixtureExport)
      : null;
  });

  return fixtureNamesByPath;
}
