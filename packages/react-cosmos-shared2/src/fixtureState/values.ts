import { FixtureState, FixtureStateValuePair } from './shared';

export function findFixtureStateValue(
  fixtureState: FixtureState,
  inputName: string
): void | FixtureStateValuePair {
  const { values } = fixtureState;
  return values && values[inputName];
}
