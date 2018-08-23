// @flow

import { find } from 'lodash';
import { updateItem } from './utility';
import { extractValuesFromObject } from './values';

import type { FixtureState, FixtureStateUpdater } from '../types/fixture-state';

export function updateFixtureState(
  fixtureState: FixtureState,
  updater: FixtureStateUpdater
) {
  const fixtureChange =
    typeof updater === 'function' ? updater(fixtureState) : updater;

  return {
    ...fixtureState,
    ...fixtureChange
  };
}

export function getProps({ props }: FixtureState) {
  if (!props) {
    throw new Error(`Missing props in fixture state`);
  }

  return props;
}

export function setProps(
  fixtureState: FixtureState,
  instanceId: number,
  instanceProps: { [key: string]: mixed }
) {
  const allProps = getProps(fixtureState);
  const instance = find(allProps, i => i.instanceId === instanceId);

  if (!instance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    props: updateItem(allProps, instance, {
      values: extractValuesFromObject(instanceProps)
    })
  });
}

export function resetProps(
  fixtureState: FixtureState,
  instanceId: number,
  instanceProps: { [key: string]: mixed }
) {
  const allProps = getProps(fixtureState);
  const instance = find(allProps, i => i.instanceId === instanceId);

  if (!instance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    props: updateItem(allProps, instance, {
      renderKey: instance.renderKey + 1,
      values: extractValuesFromObject(instanceProps)
    })
  });
}

export function getState({ state }: FixtureState) {
  if (!state) {
    throw new Error(`Missing state in fixture state`);
  }

  return state;
}

export function setState(
  fixtureState: FixtureState,
  instanceId: number,
  instanceState: { [key: string]: mixed }
) {
  const allStates = getState(fixtureState);
  const stateInstance = find(allStates, i => i.instanceId === instanceId);

  if (!stateInstance) {
    throw new Error(`Missing state with instanceId: ${instanceId}`);
  }

  return updateFixtureState(fixtureState, {
    state: updateItem(allStates, stateInstance, {
      values: extractValuesFromObject(instanceState)
    })
  });
}
