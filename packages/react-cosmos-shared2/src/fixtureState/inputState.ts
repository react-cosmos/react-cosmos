import { FixtureState, FixtureStateValue2 } from './shared';

export function findFixtureStateInputState(
  fixtureState: FixtureState,
  inputName: string
): void | FixtureStateValue2 {
  const { inputState } = fixtureState;
  return inputState && inputState[inputName];
}
