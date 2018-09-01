// @flow

// TODO: Move to fixtureState
import type {
  FixtureStateValue,
  FixtureStateValues
} from '../types/fixtureState';

// Why store unserializable props in fixture state?
// - Because they still provides value in the Cosmos UI. They let the user know
//   that a prop is present and, in come cases, a read-only stringified value.
// - More importantly, because the fixture state controls which props to render.
//   This way, if a prop is read-only and cannot be edited in the UI, it can
//   still be removed.
export function extractValuesFromObject(obj: {
  [string]: mixed
}): FixtureStateValues {
  return Object.keys(obj).map(key => ({
    // TODO: Detect unserializable props and stringify values
    serializable: true,
    key,
    value: obj[key]
  }));
}

export function areValuesEqual(a: FixtureStateValues, b: FixtureStateValues) {
  return (
    // If the number of values changed then clearly they're not equal
    a.length === b.length &&
    a.reduce((res, aVal, idx) => res && isValueEqual(aVal, b[idx]), true)
  );
}

function isValueEqual(a: FixtureStateValue, b: FixtureStateValue) {
  // In theory .value shouldn't be compared if the value is not serializable.
  // But since unserializable values never change, the comparison still holds.
  return a.key === b.key && a.value === b.value;
}
