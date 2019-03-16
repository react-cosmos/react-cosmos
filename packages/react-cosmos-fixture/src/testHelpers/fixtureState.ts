import {
  FixtureDecoratorId,
  FixtureStateValue,
  FixtureStateProps,
  FixtureStateClassState,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';

export function anyProps(
  args: {
    decoratorId?: FixtureDecoratorId;
    elPath?: string;
    componentName?: string;
    values?: FixtureStateValue[];
  } = {}
): FixtureStateProps {
  const {
    decoratorId = expect.any(String),
    elPath = expect.any(String),
    componentName = expect.any(String),
    values = expect.any(Array)
  } = args;
  return {
    elementId: { decoratorId, elPath },
    componentName,
    renderKey: expect.any(Number),
    values
  };
}

export function anyClassState(args: {
  decoratorId?: FixtureDecoratorId;
  elPath?: string;
  values: FixtureStateValue[];
}): FixtureStateClassState {
  const {
    decoratorId = expect.any(String),
    elPath = expect.any(String),
    values
  } = args;
  return {
    elementId: { decoratorId, elPath },
    values
  };
}

export function getProps(
  fixtureState: FixtureState,
  expectedCount: number = 1
) {
  const { props } = fixtureState;
  if (!props || props.length < expectedCount) {
    throw new Error(`Props missing in fixture state`);
  }
  return props;
}

export function getClassState(
  fixtureState: FixtureState,
  expectedCount: number = 1
) {
  const { classState } = fixtureState;
  if (!classState || classState.length < expectedCount) {
    throw new Error(`Class state missing in fixture state`);
  }
  return classState;
}
