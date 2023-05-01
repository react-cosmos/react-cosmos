import React from 'react';
import { findFixtureStateControl } from '../../shared/fixtureState/controls.js';
import { extendWithValue } from '../../shared/fixtureState/extendWithValues.js';
import { FixtureStateData } from '../../shared/fixtureState/types.js';
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
