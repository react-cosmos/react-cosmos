import { isEqual, omit } from 'lodash';
import React from 'react';
import {
  findFixtureStateCustomState,
  FixtureStateValue2,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '.';

type Args = {
  defaultValue: number;
  inputName: string;
};

type SetNumber = React.Dispatch<React.SetStateAction<number>>;
type ReturnVal = [number, SetNumber];

export function useNumber({ defaultValue, inputName }: Args): ReturnVal {
  useSyncFixtureState(inputName, defaultValue);
  useCleanFixtureState(inputName);
  const value = useNumberValue(inputName, defaultValue);
  const setValue = useSetNumberValue(inputName, defaultValue);
  return [value, setValue];
}

function useSyncFixtureState(inputName: string, defaultValue: number) {
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

function useCleanFixtureState(inputName: string) {
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

function useNumberValue(inputName: string, defaultValue: number): number {
  const { fixtureState } = React.useContext(FixtureContext);
  const fsValue = findFixtureStateCustomState(fixtureState, inputName);
  return fsValue && typeof fsValue.currentValue === 'number'
    ? fsValue.currentValue
    : defaultValue;
}

function useSetNumberValue(inputName: string, defaultValue: number): SetNumber {
  const { setFixtureState } = React.useContext(FixtureContext);
  return React.useCallback(
    stateChange => {
      setFixtureState(prevFsState => {
        const currentValue: number =
          typeof stateChange === 'function'
            ? stateChange(getCurrentValue(prevFsState, inputName))
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
    [defaultValue, inputName, setFixtureState]
  );
}

function getCurrentValue(fsState: FixtureState, inputName: string): number {
  const fsValue = findFixtureStateCustomState(fsState, inputName);
  if (!fsValue) {
    throw new Error(`Fixture state value missing for input name: ${inputName}`);
  }
  if (typeof fsValue.currentValue !== 'number') {
    throw new Error(`Expected number type for input name: ${inputName}`);
  }
  return fsValue.currentValue;
}
