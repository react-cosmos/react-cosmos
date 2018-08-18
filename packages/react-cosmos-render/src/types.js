// @flow

export type FixtureDataProp = {
  serializable: boolean,
  key: string,
  value: mixed
};

// TODO: Tie props data to component (uniqueId + displayName)
export type FixtureDataProps = Array<FixtureDataProp>;

export type FixtureData = {
  props?: FixtureDataProps,
  [key: string]: mixed
};

export type UpdateFixtureData = (key: string, value: mixed) => mixed;

export type FixtureContextValue = {
  fixtureData: FixtureData,
  updateFixtureData: UpdateFixtureData
};
