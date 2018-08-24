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
  newProps: { [key: string]: mixed }
) {
  const propsInstance = getPropsInstance(fixtureState, instanceId);

  if (!propsInstance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    props: updateItem(getProps(fixtureState), propsInstance, {
      values: extractValuesFromObject(newProps)
    })
  });
}

export function resetProps(
  fixtureState: FixtureState,
  instanceId: number,
  newProps: { [key: string]: mixed }
) {
  const propsInstance = getPropsInstance(fixtureState, instanceId);

  if (!propsInstance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    props: updateItem(getProps(fixtureState), propsInstance, {
      renderKey: propsInstance.renderKey + 1,
      values: extractValuesFromObject(newProps)
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
  newState: { [key: string]: mixed }
) {
  const stateInstance = getStateInstance(fixtureState, instanceId);

  if (!stateInstance) {
    throw new Error(`Missing state with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    state: updateItem(getState(fixtureState), stateInstance, {
      values: extractValuesFromObject(newState)
    })
  });
}
