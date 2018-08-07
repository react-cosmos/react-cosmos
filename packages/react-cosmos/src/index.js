// @flow

import type { FixtureType } from 'react-cosmos-flow/fixture';

export function createFixture<P: {}, F: FixtureType<P>>(fixture: F): F {
  return fixture;
}
