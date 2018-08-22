// @flow

type FixtureStateValue = {
  serializable: boolean,
  key: string,
  value: mixed
};

export type FixtureStateValues = Array<FixtureStateValue>;

export type FixtureStateInstanceProps = {
  instanceId: number,
  componentName: string,
  renderKey: number,
  values: FixtureStateValues
};

export type FixtureStateInstanceState = {
  instanceId: number,
  componentName: string,
  values: FixtureStateValues
};

export type FixtureState = {
  props?: Array<FixtureStateInstanceProps>,
  state?: Array<FixtureStateInstanceState>,
  [key: string]: mixed
};

export type SetFixtureState = (
  update: $Shape<FixtureState> | (FixtureState => $Shape<FixtureState>),
  callback?: () => mixed
) => mixed;

export type FixtureContextValue = {
  fixtureState: FixtureState,
  setFixtureState: SetFixtureState
};
