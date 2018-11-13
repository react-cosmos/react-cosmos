// @flow

import type {
  KeyValue,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';

export function createCompFxState(args: {
  componentName?: string,
  elPath?: string,
  props?: FixtureStateValues,
  state?: FixtureStateValues
}) {
  const {
    componentName = expect.any(String),
    elPath = expect.any(String),
    props = null,
    state = null
  } = args;

  return {
    decoratorId: expect.any(Number),
    elPath,
    componentName,
    renderKey: expect.any(Number),
    props,
    state
  };
}

export function createFxValues(obj: KeyValue): FixtureStateValues {
  return Object.keys(obj).map(key => ({
    serializable: true,
    key: key,
    stringified: JSON.stringify(obj[key])
  }));
}
