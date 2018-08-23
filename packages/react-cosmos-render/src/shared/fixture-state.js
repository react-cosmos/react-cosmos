// @flow

import { findIndex } from 'lodash';
import { extractValuesFromObject } from './values';

import type { FixtureState, FixtureStateUpdater } from '../types/fixture-state';

// TODO: Use this where needed
// export function replaceOrAddInList<Item>(
//   items: Array<Item>,
//   item: Item,
//   matcher: Item => boolean
// ) {
//   const index = findIndex(items, matcher);
//
//   return index
//     ? [...items.slice(0, index), item, ...items.slice(index + 1)]
//     : [...items, item];
// }

// TODO: Merge with updateFixtureState
export function setFixtureUpdater(
  fixtureState: FixtureState,
  updater: FixtureStateUpdater
): FixtureState {
  const fixtureChange =
    typeof updater === 'function' ? updater(fixtureState) : updater;

  return {
    ...fixtureState,
    ...fixtureChange
  };
}

export function updateFixtureState(
  fixtureState: FixtureState,
  updater: FixtureStateUpdater
) {
  return setFixtureUpdater(fixtureState, updater);
}

export function getProps({ props }: FixtureState) {
  if (!props) {
    throw new Error(`Missing props in fixture state`);
  }

  return props;
}

// TODO: Extract reusable private method from setProps & resetProps & setState
export function setProps(
  fixtureState: FixtureState,
  instanceId: number,
  instanceProps: { [key: string]: mixed }
) {
  const allProps = getProps(fixtureState);
  const index = findIndex(allProps, i => i.instanceId === instanceId);

  if (index === -1) {
    throw new Error(`Missing props with ${instanceId} instanceId`);
  }

  const propsInstance = {
    ...allProps[index],
    values: extractValuesFromObject(instanceProps)
  };

  return updateFixtureState(fixtureState, {
    props: [
      ...allProps.slice(0, index),
      propsInstance,
      ...allProps.slice(index + 1)
    ]
  });
}

export function resetProps(
  fixtureState: FixtureState,
  instanceId: number,
  instanceProps: { [key: string]: mixed }
) {
  const allProps = getProps(fixtureState);
  const index = findIndex(allProps, i => i.instanceId === instanceId);

  if (index === -1) {
    throw new Error(`Missing props with ${instanceId} instanceId`);
  }

  const { renderKey } = allProps[index];
  const propsInstance = {
    ...allProps[index],
    renderKey: renderKey + 1,
    values: extractValuesFromObject(instanceProps)
  };

  return updateFixtureState(fixtureState, {
    props: [
      ...allProps.slice(0, index),
      propsInstance,
      ...allProps.slice(index + 1)
    ]
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
  const index = findIndex(allStates, i => i.instanceId === instanceId);

  if (index === -1) {
    throw new Error(`Missing state with ${instanceId} instanceId`);
  }

  const propsInstance = {
    ...allStates[index],
    values: extractValuesFromObject(instanceState)
  };

  return updateFixtureState(fixtureState, {
    state: [
      ...allStates.slice(0, index),
      propsInstance,
      ...allStates.slice(index + 1)
    ]
  });
}
