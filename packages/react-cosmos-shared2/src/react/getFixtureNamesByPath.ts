import { FixtureNamesByPath } from '../renderer';
import { ReactFixtureExportsByPath } from './shared';
import { isMultiFixture } from './isMultiFixture';

export function getFixtureNamesByPath(
  fixtureExportsByPath: ReactFixtureExportsByPath
): FixtureNamesByPath {
  const fixtureNamesByPath: FixtureNamesByPath = {};
  Object.keys(fixtureExportsByPath).forEach(fixturePath => {
    const fixtureExport = fixtureExportsByPath[fixturePath];
    fixtureNamesByPath[fixturePath] = isMultiFixture(fixtureExport)
      ? Object.keys(fixtureExport)
      : null;
  });

  return fixtureNamesByPath;
}
