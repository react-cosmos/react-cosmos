export type FixtureId = {
  path: string;
  name?: string;
};

export type FixtureListItem =
  | { type: 'unknown' }
  | { type: 'single' }
  | { type: 'multi'; fixtureNames: string[] };

export type FixtureList = {
  [fixturePath: string]: FixtureListItem;
};
