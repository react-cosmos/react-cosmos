import { isEqual, omit } from 'lodash';
import React from 'react';
import {
  findFixtureStateCustomState,
  FixtureState,
  FixtureStatePrimitiveValueType,
  FixtureStateValue2
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';

export type SetValue<Value> = React.Dispatch<React.SetStateAction<Value>>;
export type UseValueReturn<Value> = [Value, SetValue<Value>];

export type IsType<Value extends FixtureStatePrimitiveValueType> = (
  value: unknown
) => value is Value;

export function usePrimitiveValue<Value extends FixtureStatePrimitiveValueType>(
  inputName: string,
  defaultValue: Value,
  isType: IsType<Value>
): UseValueReturn<Value> {
  const value = useGetPrimitiveValue(inputName, defaultValue, isType);
  const setValue = useSetPrimitiveValue(inputName, defaultValue, isType);
  useSyncFixtureStateValue(inputName, defaultValue);
  useCleanFixtureStateValue(inputName);
  return [value, setValue];
}

function useGetPrimitiveValue<Value extends FixtureStatePrimitiveValueType>(
  inputName: string,
  defaultValue: Value,
  isType: IsType<Value>
): Value {
  const { fixtureState } = React.useContext(FixtureContext);
  const fsValue = findFixtureStateCustomState(fixtureState, inputName);
  return fsValue && isType(fsValue.currentValue)
    ? fsValue.currentValue
    : defaultValue;
}

function useSetPrimitiveValue<Value extends FixtureStatePrimitiveValueType>(
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
            ? stateChange(getPrimitiveValue(prevFsState, inputName, isType))
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
    [defaultValue, inputName, isType, setFixtureState]
  );
}

function getPrimitiveValue<Value extends FixtureStatePrimitiveValueType>(
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

function useSyncFixtureStateValue<Value>(
  inputName: string,
  defaultValue: Value
) {
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    setFixtureState(prevFsState => {
      const prevFsValue = findFixtureStateCustomState(prevFsState, inputName);
      if (prevFsValue && isEqual(prevFsValue.defaultValue, defaultValue)) {
        return prevFsState;
      }

      return {
        ...prevFsState,
        customState: {
          ...prevFsState.customState,
          [inputName]: {
            type: 'primitive',
            defaultValue,
            currentValue: defaultValue
          }
        }
      };
    });
  }, [inputName, defaultValue, fixtureState, setFixtureState]);
}

function useCleanFixtureStateValue(inputName: string) {
  const { setFixtureState } = React.useContext(FixtureContext);
  const prevInputName = React.useRef<string>(inputName);
  React.useEffect(() => {
    prevInputName.current = inputName;
    return () => {
      setFixtureState(prevFsState => {
        const { customState = {} } = prevFsState;
        return {
          ...prevFsState,
          customState: omit(customState, prevInputName.current)
        };
      });
    };
  }, [inputName, setFixtureState]);
}
