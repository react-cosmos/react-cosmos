// @flow

type FixtureStateValue = {
  serializable: boolean,
  key: string,
  value: mixed
};

export type FixtureStateValues = Array<FixtureStateValue>;

export type ComponentMetadata = {
  instanceId: number,
  name: string
};

export type FixtureStateProps = {
  component: ComponentMetadata,
  renderKey: number,
  values: FixtureStateValues
};

export type FixtureStateState = {
  component: ComponentMetadata,
  renderKey: number,
  values: FixtureStateValues
};

export type FixtureState = {
  props?: Array<FixtureStateProps>,
  state?: Array<FixtureStateState>,
  [key: string]: mixed
};

export type SetFixtureState = (
  $Shape<FixtureState> | (FixtureState => $Shape<FixtureState>)
) => mixed;

export type FixtureContextValue = {
  fixtureState: FixtureState,
  setFixtureState: SetFixtureState
};
