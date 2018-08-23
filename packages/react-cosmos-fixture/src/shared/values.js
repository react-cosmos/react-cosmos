// @flow

import type { FixtureStateValues } from '../types/fixture-state';

// Why store unserializable props in fixture state?
// - Because they still provides value in the Cosmos UI. They let the user know
//   that a prop is present and, in come cases, a read-only stringified value.
// - More importantly, because the fixture state controls which props to render.
//   This way, if a prop is read-only and cannot be edited in the UI, it can
//   still be removed.
export function extractValuesFromObject(object: {}): FixtureStateValues {
  return Object.keys(object).map(key => ({
    // TODO: Detect unserializable props and stringify values
    serializable: true,
    key,
    value: object[key]
  }));
}
