// @flow

type FixtureStateValue = {
  serializable: boolean,
  key: string,
  value: mixed
};

export type FixtureStateValues = Array<FixtureStateValue>;

export type ComponentMetadata = {
  id: number,
  name: string
};

export type FixtureStateProps = Array<{
  component: ComponentMetadata,
  values: FixtureStateValues
}>;

export type FixtureState = {
  props?: FixtureStateProps,
  [key: string]: mixed
};

export type SetFixtureState = ($Shape<FixtureState>) => mixed;

export type FixtureContextValue = {
  fixtureState: FixtureState,
  setFixtureState: SetFixtureState
};
