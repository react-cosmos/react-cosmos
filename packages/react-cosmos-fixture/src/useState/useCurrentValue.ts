import React from 'react';
import { FixtureStateValueType } from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { getCurrentValue } from './shared';

export function useCurrentValue<T extends FixtureStateValueType>(
  inputName: string,
  defaultValue: T
): T {
  const { fixtureState } = React.useContext(FixtureContext);
  return getCurrentValue(fixtureState, inputName, defaultValue);
}
