import { FixtureId, FixtureState } from 'react-cosmos-core';

export type SelectedFixture = {
  fixtureId: FixtureId;
  // fixtureParams: FixtureParams;
  initialFixtureState: FixtureState;
  renderKey: number;
};
