import React from 'react';
import {
  createValue,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { getCurrentValue, updateCustomState } from './shared';

export function useCreateFixtureState(
  inputName: string,
  defaultValue: FixtureStateValueType
) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    setFixtureState(prevFsState => {
      return updateCustomState(prevFsState, customState => {
        const currentValue = getCurrentValue(
          prevFsState,
          inputName,
          defaultValue
        );
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
