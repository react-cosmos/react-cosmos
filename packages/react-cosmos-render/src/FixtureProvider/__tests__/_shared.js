// @flow

import { extractValuesFromObject } from '../../shared/values';
import { setFixtureUpdater } from '../../shared/fixture-state';

import type { FixtureState, FixtureStateUpdater } from '../../types/fixture';

export function updateFixtureState(
  prevState: FixtureState,
  updater: FixtureStateUpdater,
  cb?: () => mixed
) {
  const nextState = setFixtureUpdater(prevState, updater);

  if (typeof cb === 'function') {
    cb();
  }

  return nextState;
}

export function getProps({ props }: FixtureState) {
  if (!props) {
    throw new Error(`Missing props in fixture state`);
  }

  return props;
}

export function setProps(
  fixtureState: FixtureState,
  ...instances: Array<{ [key: string]: mixed }>
) {
  const props = getProps(fixtureState);

  let nextProps = instances.map((instance, index) => {
    if (!props[index]) {
      throw new Error(`Missing props at ${index} index in fixture state`);
    }

    return {
      ...props[index],
      values: extractValuesFromObject(instance)
    };
  });

  return updateFixtureState(fixtureState, { props: nextProps });
}

export function resetProps(
  fixtureState: FixtureState,
  ...instances: Array<{ [key: string]: mixed }>
) {
  const props = getProps(fixtureState);

  let nextProps = instances.map((instance, index) => {
    if (!props[index]) {
      throw new Error(`Missing props at ${index} index in fixture state`);
    }

    const { renderKey } = props[index];

    return {
      ...props[index],
      renderKey: renderKey + 1,
      values: extractValuesFromObject(instance)
    };
  });

  return updateFixtureState(fixtureState, { props: nextProps });
}

export function getState({ state }: FixtureState) {
  if (!state) {
    throw new Error(`Missing state in fixture state`);
  }

  return state;
}

export function setState(
  fixtureState: FixtureState,
  ...instances: Array<{ [key: string]: mixed }>
) {
  const state = getState(fixtureState);

  let nextState = instances.map((instance, index) => {
    if (!state[index]) {
      throw new Error(`Missing state at ${index} index in fixture state`);
    }

    return {
      ...state[index],
      values: extractValuesFromObject(instance)
    };
  });

  return updateFixtureState(fixtureState, { state: nextState });
}
