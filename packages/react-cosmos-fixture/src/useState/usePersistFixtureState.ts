import React from 'react';
import {
  FixtureStateValueType,
  extendWithValue
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { persistValue } from './shared/persistentValueStore';

export function usePersistFixtureState(defaultValue: FixtureStateValueType) {
  const { fixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    const { customState = {} } = fixtureState;
    Object.keys(customState).forEach(inputName => {
      const fsValueGroup = customState[inputName];
      persistValue({
        inputName,
        defaultValue: extendWithValue(defaultValue, fsValueGroup.defaultValue),
        currentValue: extendWithValue(defaultValue, fsValueGroup.currentValue)
      });
    });
  }, [defaultValue, fixtureState]);
}
