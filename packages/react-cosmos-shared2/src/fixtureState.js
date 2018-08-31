// @flow

import { find } from 'lodash';
import { updateItem } from './utility';
import { extractValuesFromObject } from './values';
import { updateState } from './state';

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

export function setFixtureStateProps(
  fixtureState: ?FixtureState,
  instanceId: number,
  newProps: { [key: string]: mixed }
) {
  const propsInstance = getFixtureStatePropsInst(fixtureState, instanceId);

  if (!propsInstance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  return updateState(fixtureState, {
    props: updateItem(getFixtureStateProps(fixtureState), propsInstance, {
      values: extractValuesFromObject(newProps)
    })
  });
}

export function resetFixtureStateProps(
  fixtureState: FixtureState,
  instanceId: number,
  newProps: { [key: string]: mixed }
) {
  const propsInstance = getFixtureStatePropsInst(fixtureState, instanceId);

  if (!propsInstance) {
    throw new Error(`Missing props with instanceId: ${instanceId}`);
  }

  return updateState(fixtureState, {
    props: updateItem(getFixtureStateProps(fixtureState), propsInstance, {
      renderKey: propsInstance.renderKey + 1,
      values: extractValuesFromObject(newProps)
    })
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

export function setFixtureStateState(
  fixtureState: ?FixtureState,
  instanceId: number,
  newState: { [key: string]: mixed }
) {
  const stateInstance = getFixtureStateStateInst(fixtureState, instanceId);

  if (!stateInstance) {
    throw new Error(`Missing state with instanceId: ${instanceId}`);
  }

  return updateState(fixtureState, {
    state: updateItem(getFixtureStateState(fixtureState), stateInstance, {
      values: extractValuesFromObject(newState)
    })
  });
}
