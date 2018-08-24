// @flow

import { find } from 'lodash';
import { updateItem } from './utility';
import { extractValuesFromObject } from './values';

import type { FixtureState, FixtureStateUpdater } from '../types/fixtureState';

export function updateFixtureState(
  fixtureState: ?FixtureState,
  updater: FixtureStateUpdater
) {
  const fixtureChange =
    typeof updater === 'function' ? updater(fixtureState) : updater;

  return {
    ...fixtureState,
    ...fixtureChange
  };
}

export function getProps(fixtureState: ?FixtureState) {
  return (fixtureState && fixtureState.props) || [];
}

export function getPropsInstance(
  fixtureState: ?FixtureState,
  instanceId: number
) {
  return find(getProps(fixtureState), i => i.instanceId === instanceId);
}

export function setProps(
  fixtureState: ?FixtureState,
  instanceId: number,
  instanceProps: { [key: string]: mixed }
) {
  const instance = getPropsInstance(fixtureState, instanceId);

  if (!instance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    props: updateItem(getProps(fixtureState), instance, {
      values: extractValuesFromObject(instanceProps)
    })
  });
}

export function resetProps(
  fixtureState: FixtureState,
  instanceId: number,
  instanceProps: { [key: string]: mixed }
) {
  const instance = getPropsInstance(fixtureState, instanceId);

  if (!instance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    props: updateItem(getProps(fixtureState), instance, {
      renderKey: instance.renderKey + 1,
      values: extractValuesFromObject(instanceProps)
    })
  });
}

export function getState(fixtureState: ?FixtureState) {
  return (fixtureState && fixtureState.state) || [];
}

export function getStateInstance(
  fixtureState: ?FixtureState,
  instanceId: number
) {
  return find(getState(fixtureState), i => i.instanceId === instanceId);
}

export function setState(
  fixtureState: ?FixtureState,
  instanceId: number,
  instanceState: { [key: string]: mixed }
) {
  const stateInstance = getStateInstance(fixtureState, instanceId);

  if (!stateInstance) {
    throw new Error(`Missing state with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    state: updateItem(getState(fixtureState), stateInstance, {
      values: extractValuesFromObject(instanceState)
    })
  });
}
