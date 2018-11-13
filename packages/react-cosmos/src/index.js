// @flow

import type { FixtureType } from 'react-cosmos-flow/fixture';

// Not setting the return value to F because that would make createFixture
// return a generic type, which requires explicit typing of P when exporting
// the returned fixture.
// This is the Flow error from a fixture file when createFixture returned the
// F type:
//   "Missing type annotation for P. P is a type parameter declared in function
//   [1] and was implicitly instantiated at call of createFixture [2]."
// Context: https://medium.com/flow-type/asking-for-required-annotations-64d4f9c1edf8
export function createFixture<P: {}, F: FixtureType<P>>(fixture: F) {
  return fixture;
}
