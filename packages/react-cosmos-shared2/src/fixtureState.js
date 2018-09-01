// @flow

import { find } from 'lodash';
import { updateItem } from './utility';
import { extractValuesFromObject } from './values';

import type { FixtureState } from '../types/fixtureState';

export function getFixtureStateProps(fixtureState: ?FixtureState) {
  return (fixtureState && fixtureState.props) || [];
}

export function getFixtureStatePropsInst(
  fixtureState: ?FixtureState,
  instanceId: number
) {
  return find(
    getFixtureStateProps(fixtureState),
    i => i.instanceId === instanceId
  );
}

export function updateFixtureStateProps(
  fixtureState: ?FixtureState,
  instanceId: number,
  newProps: { [key: string]: mixed },
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

export function getFixtureStateState(fixtureState: ?FixtureState) {
  return (fixtureState && fixtureState.state) || [];
}

export function getFixtureStateStateInst(
  fixtureState: ?FixtureState,
  instanceId: number
) {
  return find(
    getFixtureStateState(fixtureState),
    i => i.instanceId === instanceId
  );
}

export function updateFixtureStateState(
  fixtureState: ?FixtureState,
  instanceId: number,
  newState: { [key: string]: mixed }
) {
  const stateInstance = getFixtureStateStateInst(fixtureState, instanceId);

  if (!stateInstance) {
    throw new Error(`Missing state with instanceId: ${instanceId}`);
  }

  return updateItem(getFixtureStateState(fixtureState), stateInstance, {
    values: extractValuesFromObject(newState)
  });
}
