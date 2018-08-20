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

export type FixtureStateProps = Array<{
  component: ComponentMetadata,
  values: FixtureStateValues
}>;

export type FixtureState = {
  props?: FixtureStateProps,
  // TODO: Add explicit type for state
  [key: string]: mixed
};

export type SetFixtureState = (
  $Shape<FixtureState> | (FixtureState => $Shape<FixtureState>)
) => mixed;

export type FixtureContextValue = {
  fixtureState: FixtureState,
  setFixtureState: SetFixtureState
};
