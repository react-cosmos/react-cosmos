// @flow

import { find, isEqual } from 'lodash';
import { isElement } from 'react-is';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { updateItem } from './util';

import type {
  FixtureStateInstanceId,
  FixtureStateValue,
  FixtureStateValues,
  FixtureState
} from './fixtureState.js.flow';

// Why store unserializable values in fixture state?
// - Because they still provides value in the Cosmos UI. They let the user know
//   that, eg. a prop, is present and see the read-only stringified value.
// - More importantly, because the fixture state controls which props to render.
//   This way, if a prop is read-only and cannot be edited in the UI, it can
//   still be removed.
export function extractValuesFromObject(obj: {
  [string]: mixed
}): FixtureStateValues {
  return Object.keys(obj).map(key => stringifyValue(key, obj[key]));
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

export function updateFixtureStateProps(
  fixtureState: ?FixtureState,
  instanceId: FixtureStateInstanceId,
  values: FixtureStateValues,
  resetInstance?: boolean = false
) {
  const propsInstance = getFixtureStatePropsInst(fixtureState, instanceId);

  if (!propsInstance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  const { renderKey } = propsInstance;

  return updateItem(getFixtureStateProps(fixtureState), propsInstance, {
    renderKey: resetInstance ? renderKey + 1 : renderKey,
    values
  });
}

export function updateFixtureStateState(
  fixtureState: ?FixtureState,
  instanceId: FixtureStateInstanceId,
  values: FixtureStateValues
) {
  const stateInstance = getFixtureStateStateInst(fixtureState, instanceId);

  if (!stateInstance) {
    throw new Error(`Missing state with instanceId: ${instanceId}`);
  }

  return updateItem(getFixtureStateState(fixtureState), stateInstance, {
    values
  });
}

function isValueEqual(a: FixtureStateValue, b: FixtureStateValue) {
  // In theory .value shouldn't be compared if the value is not serializable.
  // But since unserializable values never change, the comparison still holds.
  return a.key === b.key && a.stringified === b.stringified;
}

function stringifyValue(key: string, value: mixed): FixtureStateValue {
  try {
    // XXX: Is this optimal?
    if (!isEqual(JSON.parse(JSON.stringify(value)), value)) {
      throw new Error('Unserializable value');
    }
  } catch (err) {
    return {
      serializable: false,
      key,
      // TODO: Enable custom stringifiers to plug in
      stringified: isElement(value)
        ? // $FlowFixMe No static way to show that value is React.Element
          reactElementToJSXString(value)
        : String(value)
    };
  }

  return {
    serializable: true,
    key,
    stringified: JSON.stringify(value)
  };
}
