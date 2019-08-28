import React from 'react';
import {
  createValue,
  findFixtureStateCustomState,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { fsValueExtendsBaseValue, updateCustomState } from './shared';
import { getPersistedValue } from './shared/persistentValueStore';

export function useCreateFixtureState(
  inputName: string,
  defaultValue: FixtureStateValueType
) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    setFixtureState(prevFsState => {
      return updateCustomState(prevFsState, customState => {
        const fsValueGroup = findFixtureStateCustomState(
          prevFsState,
          inputName
        );
        if (
          fsValueGroup &&
          fsValueExtendsBaseValue(fsValueGroup.defaultValue, defaultValue)
        ) {
          return customState;
        }

        const currentValue = getPersistedValue({ inputName, defaultValue });
        return {
          ...customState,
          [inputName]: {
            defaultValue: createValue(defaultValue),
            currentValue: createValue(currentValue)
          }
        };
      });
    });
  }, [setFixtureState, inputName, defaultValue]);
}
