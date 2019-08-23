import React from 'react';
import {
  createValue,
  findFixtureStateCustomState,
  FixtureState,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { SetValue } from './shared';

export function useSetValue<T extends FixtureStateValueType>(
  inputName: string,
  defaultValue: T
): SetValue<T> {
  const { setFixtureState } = React.useContext(FixtureContext);
  return React.useCallback(
    stateChange => {
      setFixtureState(prevFsState => {
        const currentValue: FixtureStateValueType =
          typeof stateChange === 'function'
            ? stateChange(
                // FIXME: Ensure current value in fixture state is of `T` type
                getCurrentValueFromFixtureState(prevFsState, inputName) as T
              )
            : stateChange;
        return {
          ...prevFsState,
          customState: {
            ...prevFsState.customState,
            [inputName]: {
              defaultValue: createValue(defaultValue),
              currentValue: createValue(currentValue)
            }
          }
        };
      });
    },
    [setFixtureState, defaultValue, inputName]
  );
}

function getCurrentValueFromFixtureState(
  fsState: FixtureState,
  inputName: string
): FixtureStateValueType {
  const fsValue = findFixtureStateCustomState(fsState, inputName);
  if (!fsValue) {
    throw new Error(`Fixture state value missing for input name: ${inputName}`);
  }
  // if (!isType(fsValue.currentValue)) {
  //   const typeOf = typeof fsValue.currentValue;
  //   throw new Error(`Invalid ${typeOf} type for input name: ${inputName}`);
  // }
  const { currentValue } = fsValue;

  if (currentValue.type === 'unserializable') {
    throw new Error('asd');
  }

  if (currentValue.type === 'object' || currentValue.type === 'array') {
    return currentValue.values;
  }

  return currentValue.value;
}
