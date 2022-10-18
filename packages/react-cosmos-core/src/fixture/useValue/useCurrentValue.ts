import React from 'react';
import { findFixtureStateControl } from '../../fixtureState/controls.js';
import { extendWithValue } from '../../fixtureState/extendWithValues.js';
import { FixtureStateData } from '../../fixtureState/types.js';
import { FixtureContext } from '../FixtureContext.js';

export function useCurrentValue<T extends FixtureStateData>(
  inputName: string,
  defaultValue: T
): T {
  const { fixtureState } = React.useContext(FixtureContext);
  const fsControl = findFixtureStateControl(fixtureState, inputName);
  return fsControl && fsControl.type === 'standard'
    ? // Types of fixture state values cannot be guaranteed at read time, which
      // means that tampering with the fixture state can cause runtime errors
      (extendWithValue(defaultValue, fsControl.currentValue) as T)
    : defaultValue;
}
