import {
  FixtureDecoratorId,
  FixtureState,
  FixtureStateClassState,
  FixtureStateControls,
  FixtureStateProps,
  FixtureStateValues,
} from 'react-cosmos-core';

export function anyProps(
  args: {
    decoratorId?: FixtureDecoratorId;
    elPath?: string;
    componentName?: string;
    values?: FixtureStateValues;
  } = {}
): FixtureStateProps {
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
}): FixtureStateClassState {
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
  const props = fixtureStateByName<FixtureStateProps[]>(fixtureState, 'props');
  if (!props || props.length < expectedCount) {
    throw new Error(`Props missing in fixture state`);
  }
  return props;
}

export function getClassState(
  fixtureState: FixtureState,
  expectedCount: number = 1
) {
  const classState = fixtureStateByName<FixtureStateClassState[]>(
    fixtureState,
    'classState'
  );
  if (!classState || classState.length < expectedCount) {
    throw new Error(`Class state missing in fixture state`);
  }
  return classState;
}

export function getControls(fixtureState: FixtureState) {
  return fixtureStateByName<FixtureStateControls>(fixtureState, 'controls');
}

function fixtureStateByName<T>(fixtureState: FixtureState, name: string) {
  return fixtureState[name] as T | undefined;
}
