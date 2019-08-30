import { FixtureState, FixtureStateValueGroup } from './shared';

export function findFixtureStateCustomState(
  fixtureState: FixtureState,
  inputName: string
): void | FixtureStateValueGroup {
  const { customState } = fixtureState;
  return customState && customState[inputName];
}
