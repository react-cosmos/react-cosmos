import { isEqual } from 'lodash';
import React from 'react';
import {
  extendWithValue,
  FixtureState,
  FixtureStateValue,
  FixtureStateValueGroups,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';

export type SetValue<T extends FixtureStateValueType> = React.Dispatch<
  React.SetStateAction<T>
>;

export function fsValueExtendsBaseValue(
  fsValue: FixtureStateValue,
  baseValue: unknown
) {
  return isEqual(baseValue, extendWithValue(baseValue, fsValue));
}

export function updateCustomState(
  fixtureState: FixtureState,
  updater: (prevCustomState: FixtureStateValueGroups) => FixtureStateValueGroups
): FixtureState {
  return {
    ...fixtureState,
    customState: updater(fixtureState.customState || {})
  };
}
