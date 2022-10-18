export type FixtureId = {
  path: string;
  name?: string;
};

// TODO: Move to renderer?
export type FixtureListItem =
  | { type: 'single' }
  | { type: 'multi'; fixtureNames: string[] };

export type FixtureList = {
  [fixturePath: string]: FixtureListItem;
};
