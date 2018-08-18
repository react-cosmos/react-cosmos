// @flow

export type FixtureData = { [key: string]: mixed };

export type UpdateFixtureData = (key: string, value: mixed) => mixed;

export type FixtureContextValue = {
  fixtureData: FixtureData,
  updateFixtureData: UpdateFixtureData
};
