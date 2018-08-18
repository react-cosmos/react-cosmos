// @flow

import type { FixtureDataProps } from './types';

// Why store unserializable props in fixture data?
// - Because they still provides value in the Cosmos UI. They let the user know
//   that a prop is present and, in come cases, a read-only stringified value.
// - More importantly, because the fixture data controls which props to render.
//   This way, if a prop is read-only and cannot be edited in the UI, it can
//   still be removed.
export function extractPropsFromObject(object: {}): FixtureDataProps {
  return Object.keys(object).map(key => ({
    // TODO: Detect unserializable props and stringify values
    serializable: true,
    key,
    value: object[key]
  }));
}
