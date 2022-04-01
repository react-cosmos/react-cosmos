import { FixtureState, FixtureStateControl } from './types';

export function findFixtureStateControl(
  fixtureState: FixtureState,
  inputName: string
): void | FixtureStateControl {
  const { controls } = fixtureState;
  return controls && controls[inputName];
}
