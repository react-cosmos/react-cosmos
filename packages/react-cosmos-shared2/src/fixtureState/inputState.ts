import { FixtureState, FixtureStateInputState } from './shared';

export function findFixtureStateInputState(
  fixtureState: FixtureState,
  inputName: string
): void | FixtureStateInputState<any> {
  const { inputState } = fixtureState;
  return inputState && inputState[inputName];
}
