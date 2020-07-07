import { FixtureState, FixtureStateControl } from './shared';

export function findFixtureStateControl(
  fixtureState: FixtureState,
  inputName: string
): void | FixtureStateControl {
  const { controls } = fixtureState;
  return controls && controls[inputName];
}
