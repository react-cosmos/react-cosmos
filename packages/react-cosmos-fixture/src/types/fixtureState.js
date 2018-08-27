// @flow

type FixtureStateValue = {
  serializable: boolean,
  key: string,
  value: mixed
};

export type FixtureStateValues = FixtureStateValue[];

export type FixtureStatePropsInstance = {
  instanceId: number,
  componentName: string,
  renderKey: number,
  values: FixtureStateValues
};

export type FixtureStateStateInstance = {
  instanceId: number,
  componentName: string,
  values: FixtureStateValues
};

export type FixtureState = {
  props?: FixtureStatePropsInstance[],
  state?: FixtureStateStateInstance[],
  [key: string]: mixed
};

export type FixtureStateUpdater =
  | $Shape<FixtureState>
  | ((prevState: ?FixtureState) => $Shape<FixtureState>);

export type SetFixtureState = (
  updater: FixtureStateUpdater,
  callback?: () => mixed
) => mixed;

export type FixtureContextValue = {
  fixtureState: ?FixtureState,
  setFixtureState: SetFixtureState
};
