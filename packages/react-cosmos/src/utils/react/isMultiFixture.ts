import { isElement } from 'react-is';
import { ReactFixtureExport, ReactFixtureMap } from './types';

export function isMultiFixture(
  fixtureExport: ReactFixtureExport
): fixtureExport is ReactFixtureMap {
  return (
    fixtureExport !== null &&
    typeof fixtureExport === 'object' &&
    !isElement(fixtureExport)
  );
}
