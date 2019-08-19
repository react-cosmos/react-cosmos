import { isEqual, omit } from 'lodash';
import React from 'react';
import {
  findFixtureStateCustomState,
  FixtureState,
  FixtureStatePrimitiveValueType,
  FixtureStateValue2,
  FixtureStateValues2
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../../FixtureContext';
import { getPersistedValue, persistValue } from './persistentValueStore';
import { IsType } from './shared';

export type SetValue<Value> = React.Dispatch<React.SetStateAction<Value>>;
export type UseValueReturn<Value> = [Value, SetValue<Value>];

export function usePrimitiveValue<Value extends FixtureStatePrimitiveValueType>(
  inputName: string,
  defaultValue: Value,
  isType: IsType<Value>
): UseValueReturn<Value> {
  useCreateFixtureState(inputName, defaultValue, isType);
  useCleanUpFixtureState(inputName);
  usePersistFixtureState();
  const currentValue = useCurrentValue(inputName, defaultValue, isType);
  const setValue = useSetValue(inputName, defaultValue, isType);
  return [currentValue, setValue];
}

function useCreateFixtureState<Value extends FixtureStatePrimitiveValueType>(
  inputName: string,
  defaultValue: Value,
  isType: IsType<Value>
) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    setFixtureState(prevFsState => {
      const fsValue = findFixtureStateCustomState(prevFsState, inputName);
      if (fsValue && isEqual(defaultValue, fsValue.defaultValue)) {
        return prevFsState;
      }

      return updateCustomState(prevFsState, customState => ({
        ...customState,
        [inputName]: {
          type: 'primitive',
          defaultValue,
          currentValue: getCurrentValue(
            prevFsState,
            inputName,
            defaultValue,
            isType
          )
        }
      }));
    });
  }, [setFixtureState, inputName, defaultValue, isType]);
}

function useCleanUpFixtureState(inputName: string) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(
    () => () => {
      setFixtureState(prevFsState =>
        updateCustomState(prevFsState, customState =>
          omit(customState, inputName)
        )
      );
    },
    [setFixtureState, inputName]
  );
}

function usePersistFixtureState() {
  const { fixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    const { customState = {} } = fixtureState;
    Object.keys(customState).forEach(inputName => {
      const { defaultValue, currentValue } = customState[inputName];
      persistValue({ inputName, defaultValue, currentValue });
    });
  }, [fixtureState]);
}

function useCurrentValue<Value extends FixtureStatePrimitiveValueType>(
  inputName: string,
  defaultValue: Value,
  isType: IsType<Value>
): Value {
  const { fixtureState } = React.useContext(FixtureContext);
  return getCurrentValue(fixtureState, inputName, defaultValue, isType);
}

function useSetValue<Value extends FixtureStatePrimitiveValueType>(
  inputName: string,
  defaultValue: Value,
  isType: IsType<Value>
): SetValue<Value> {
  const { setFixtureState } = React.useContext(FixtureContext);
  return React.useCallback(
    stateChange => {
      setFixtureState(prevFsState => {
        const currentValue: Value =
          typeof stateChange === 'function'
            ? stateChange(getExistingValue(prevFsState, inputName, isType))
            : stateChange;
        const newFsValue: FixtureStateValue2 = {
          type: 'primitive',
          defaultValue,
          currentValue
        };
        return {
          ...prevFsState,
          customState: { ...prevFsState.customState, [inputName]: newFsValue }
        };
      });
    },
    [setFixtureState, defaultValue, inputName, isType]
  );
}

function getCurrentValue<Value extends FixtureStatePrimitiveValueType>(
  fixtureState: FixtureState,
  inputName: string,
  defaultValue: Value,
  isType: IsType<Value>
): Value {
  const fsValue = findFixtureStateCustomState(fixtureState, inputName);
  return fsValue && isType(fsValue.currentValue)
    ? fsValue.currentValue
    : getPersistedValue({ inputName, defaultValue, isType });
}

function getExistingValue<Value extends FixtureStatePrimitiveValueType>(
  fsState: FixtureState,
  inputName: string,
  isType: IsType<Value>
): Value {
  const fsValue = findFixtureStateCustomState(fsState, inputName);
  if (!fsValue) {
    throw new Error(`Fixture state value missing for input name: ${inputName}`);
  }
  if (!isType(fsValue.currentValue)) {
    const typeOf = typeof fsValue.currentValue;
    throw new Error(`Invalid ${typeOf} type for input name: ${inputName}`);
  }
  return fsValue.currentValue;
}

function updateCustomState(
  fixtureState: FixtureState,
  updater: (prevCustomState: FixtureStateValues2) => FixtureStateValues2
): FixtureState {
  return {
    ...fixtureState,
    customState: updater(fixtureState.customState || {})
  };
}
