import { FixtureState, FixtureStateSelect } from './shared';

export function findFixtureStateSelect(
  fixtureState: FixtureState,
  selectName: string
): void | FixtureStateSelect {
  const { selects } = fixtureState;
  return selects && selects[selectName];
}
