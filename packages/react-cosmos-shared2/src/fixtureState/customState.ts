import { FixtureState, FixtureStateValue2 } from './shared';

export function findFixtureStateCustomState(
  fixtureState: FixtureState,
  inputName: string
): void | FixtureStateValue2 {
  const { customState } = fixtureState;
  return customState && customState[inputName];
}
