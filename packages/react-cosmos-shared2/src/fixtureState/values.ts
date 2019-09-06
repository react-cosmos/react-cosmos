import { FixtureState, FixtureStateValueGroup } from './shared';

export function findFixtureStateValue(
  fixtureState: FixtureState,
  inputName: string
): void | FixtureStateValueGroup {
  const { values } = fixtureState;
  return values && values[inputName];
}
