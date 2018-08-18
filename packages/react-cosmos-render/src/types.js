// @flow

type FixtureDataValue = {
  serializable: boolean,
  key: string,
  value: mixed
};

export type FixtureDataValues = Array<FixtureDataValue>;

export type ComponentMetadata = {
  id: number,
  name: string
};

export type FixtureDataProps = Array<{
  component: ComponentMetadata,
  values: FixtureDataValues
}>;

export type FixtureData = {
  props?: FixtureDataProps,
  [key: string]: mixed
};

export type UpdateFixtureData = ($Shape<FixtureData>) => mixed;

export type FixtureContextValue = {
  fixtureData: FixtureData,
  updateFixtureData: UpdateFixtureData
};
