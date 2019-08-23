import React from 'react';
import { FixtureStateValueType } from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { persistValue } from './shared/persistentValueStore';

export function usePersistFixtureState() {
  const { fixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    const { customState = {} } = fixtureState;
    Object.keys(customState).forEach(inputName => {
      const { defaultValue, currentValue } = customState[inputName];
      persistValue({
        inputName,
        // TODO: FIXME
        defaultValue: (defaultValue as any).value as FixtureStateValueType,
        currentValue: (currentValue as any).value as FixtureStateValueType
      });
    });
  }, [fixtureState]);
}
