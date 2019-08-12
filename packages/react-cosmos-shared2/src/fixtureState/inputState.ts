import { FixtureState, FixtureStateInputState, InputStateType } from './shared';

export function findFixtureStateInputState<T extends InputStateType>(
  fixtureState: FixtureState,
  inputName: string,
  defaultValue: number
): FixtureStateInputState<T> {
  const { inputState = {} } = fixtureState;
  return inputState[inputName] || { defaultValue, value: defaultValue };
}
