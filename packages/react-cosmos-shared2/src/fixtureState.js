// @flow

import { find } from 'lodash';
import { updateItem } from './util';

import type {
  FixtureStateInstanceId,
  FixtureStateValue,
  FixtureStateValues,
  FixtureStateProps,
  FixtureStateState,
  FixtureState,
  FixtureStateValueMap
} from './fixtureState.js.flow';

// Why store unserializable props in fixture state?
// - Because they still provides value in the Cosmos UI. They let the user know
//   that a prop is present and, in come cases, a read-only stringified value.
// - More importantly, because the fixture state controls which props to render.
//   This way, if a prop is read-only and cannot be edited in the UI, it can
//   still be removed.
export function extractValuesFromObject(obj: {
  [string]: mixed
}): FixtureStateValues {
  return Object.keys(obj).map(key => serializeValue(key, obj[key]));
}

function serializeValue(key: string, value: mixed): FixtureStateValue {
  // TODO: Detect unserializable props and stringify values
  return {
    serializable: true,
    key,
    value
  };
}

export function areValuesEqual(a: FixtureStateValues, b: FixtureStateValues) {
  return (
    // If the number of values changed then clearly they're not equal
    a.length === b.length &&
    a.reduce((res, aVal, idx) => res && isValueEqual(aVal, b[idx]), true)
  );
}

export function getFixtureStateProps(fixtureState: ?FixtureState) {
  return (fixtureState && fixtureState.props) || [];
}

export function getFixtureStatePropsInst(
  fixtureState: ?FixtureState,
  instanceId: FixtureStateInstanceId
) {
  return find(
    getFixtureStateProps(fixtureState),
    i => i.instanceId === instanceId
  );
}

export function getFixtureStateState(fixtureState: ?FixtureState) {
  return (fixtureState && fixtureState.state) || [];
}

export function getFixtureStateStateInst(
  fixtureState: ?FixtureState,
  instanceId: FixtureStateInstanceId
) {
  return find(
    getFixtureStateState(fixtureState),
    i => i.instanceId === instanceId
  );
}

export function extractValueMapFromInst(
  inst: FixtureStateProps | FixtureStateState
): FixtureStateValueMap {
  return inst.values.reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    {}
  );
}

export function updateFixtureStateProps(
  fixtureState: ?FixtureState,
  instanceId: FixtureStateInstanceId,
  newProps: FixtureStateValueMap,
  resetInstance?: boolean = false
) {
  const propsInstance = getFixtureStatePropsInst(fixtureState, instanceId);

  if (!propsInstance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  const { renderKey } = propsInstance;

  return updateItem(getFixtureStateProps(fixtureState), propsInstance, {
    renderKey: resetInstance ? renderKey + 1 : renderKey,
    values: extractValuesFromObject(newProps)
  });
}

export function updateFixtureStateState(
  fixtureState: ?FixtureState,
  instanceId: FixtureStateInstanceId,
  newState: FixtureStateValueMap
) {
  const stateInstance = getFixtureStateStateInst(fixtureState, instanceId);

  if (!stateInstance) {
    throw new Error(`Missing state with instanceId: ${instanceId}`);
  }

  return updateItem(getFixtureStateState(fixtureState), stateInstance, {
    values: extractValuesFromObject(newState)
  });
}

function isValueEqual(a: FixtureStateValue, b: FixtureStateValue) {
  // In theory .value shouldn't be compared if the value is not serializable.
  // But since unserializable values never change, the comparison still holds.
  return a.key === b.key && a.value === b.value;
}
