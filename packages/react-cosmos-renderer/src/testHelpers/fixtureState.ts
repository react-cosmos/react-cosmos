import {
  ClassStateFixtureState,
  ClassStateFixtureStateItem,
  FixtureDecoratorId,
  FixtureState,
  FixtureStateValues,
  InputsFixtureState,
  PropsFixtureState,
  PropsFixtureStateItem,
  fixtureStateByName,
} from 'react-cosmos-core';

export function anyProps(
  args: {
    decoratorId?: FixtureDecoratorId;
    elPath?: string;
    componentName?: string;
    values?: FixtureStateValues;
  } = {}
): PropsFixtureStateItem {
  const {
    decoratorId = expect.any(String),
    elPath = expect.any(String),
    componentName = expect.any(String),
    values = expect.any(Object),
  } = args;
  return {
    elementId: { decoratorId, elPath },
    componentName,
    renderKey: expect.any(Number),
    values,
  };
}

export function anyClassState(args: {
  decoratorId?: FixtureDecoratorId;
  elPath?: string;
  componentName?: string;
  values: FixtureStateValues;
}): ClassStateFixtureStateItem {
  const {
    decoratorId = expect.any(String),
    componentName = expect.any(String),
    elPath = expect.any(String),
    values,
  } = args;
  return {
    elementId: { decoratorId, elPath },
    componentName,
    values,
  };
}

export function getProps(
  fixtureState: FixtureState,
  expectedCount: number = 1
) {
  const props = fixtureStateByName<PropsFixtureState>(fixtureState, 'props');
  if (!props || props.length < expectedCount) {
    throw new Error(`Props missing in fixture state`);
  }
  return props;
}

export function getClassState(
  fixtureState: FixtureState,
  expectedCount: number = 1
) {
  const classState = fixtureStateByName<ClassStateFixtureState>(
    fixtureState,
    'classState'
  );
  if (!classState || classState.length < expectedCount) {
    throw new Error(`Class state missing in fixture state`);
  }
  return classState;
}

export function getInputs(
  fixtureState: FixtureState,
  expectedCount: number = 1
) {
  const inputs = fixtureStateByName<InputsFixtureState>(fixtureState, 'inputs');
  if (!inputs || Object.keys(inputs).length < expectedCount) {
    throw new Error(`Inputs missing in fixture state`);
  }
  return inputs;
}
