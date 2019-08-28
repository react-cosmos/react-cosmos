import React from 'react';
import {
  extendWithValue,
  findFixtureStateCustomState,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { fsValueExtendsBaseValue } from './shared';
import { persistValue } from './shared/persistentValueStore';

export function usePersistFixtureState(
  inputName: string,
  defaultValue: FixtureStateValueType
) {
  const { fixtureState } = React.useContext(FixtureContext);
  const fsValueGroup = findFixtureStateCustomState(fixtureState, inputName);
  React.useEffect(() => {
    if (
      fsValueGroup &&
      fsValueExtendsBaseValue(fsValueGroup.defaultValue, defaultValue)
    ) {
      persistValue({
        inputName,
        defaultValue,
        currentValue: extendWithValue(defaultValue, fsValueGroup.currentValue)
      });
    }
  }, [inputName, defaultValue, fsValueGroup]);
}
