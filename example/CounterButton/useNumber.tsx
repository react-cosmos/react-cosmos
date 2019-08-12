// TODO: Extract (and test) useNumber into react-cosmos-fixture package
import React from 'react';
import { isEqual } from 'lodash';
import { FixtureContext } from 'react-cosmos-fixture';
import {
  findFixtureStateCustomState,
  FixtureStatePrimitiveValue2,
  FixtureStateValue2
} from 'react-cosmos-shared2/fixtureState';

type UseNumberArgs = {
  defaultValue: number;
  inputName: string;
};

type SetNumber = React.Dispatch<React.SetStateAction<number>>;

export function useNumber({
  defaultValue,
  inputName
}: UseNumberArgs): [number, SetNumber] {
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);

  // Create fixture state
  // TODO: Remove fixture state (effect with "inputName" dep)
  React.useEffect(() => {
    setFixtureState(prevFsState => {
      const prevFsValue = findFixtureStateCustomState(prevFsState, inputName);
      if (prevFsValue) {
        if (isEqual(prevFsValue.defaultValue, defaultValue)) {
          return prevFsState;
        }
      }

      const nextFsValue: FixtureStateValue2 = {
        type: 'primitive',
        defaultValue,
        currentValue: defaultValue
      };
      return {
        ...prevFsState,
        customState: {
          ...prevFsState.customState,
          [inputName]: nextFsValue
        }
      };
    });
  }, [inputName, defaultValue, fixtureState, setFixtureState]);

  const setValue: SetNumber = React.useCallback(
    // TODO: Refactor (DRY) *after* tests
    stateChange => {
      if (typeof stateChange === 'function') {
        setFixtureState(prevFsState => {
          const prevFsValue = findFixtureStateCustomState(
            prevFsState,
            inputName
          );
          if (!prevFsValue) {
            // TODO: Warn?
            return prevFsState;
          }

          if (typeof prevFsValue.currentValue !== 'number') {
            // TODO: Warn?
            return prevFsState;
          }

          const nextFsValue: FixtureStateValue2 = {
            type: 'primitive',
            defaultValue,
            currentValue: stateChange(prevFsValue.currentValue)
          };
          return {
            ...prevFsState,
            customState: {
              ...prevFsState.customState,
              [inputName]: nextFsValue
            }
          };
        });
      } else {
        setFixtureState(prevFsState => {
          const nextFsValue: FixtureStatePrimitiveValue2 = {
            type: 'primitive',
            defaultValue,
            currentValue: stateChange
          };
          return {
            ...prevFsState,
            customState: {
              ...prevFsState.customState,
              [inputName]: nextFsValue
            }
          };
        });
      }
    },
    [defaultValue, inputName, setFixtureState]
  );

  const fsValue = findFixtureStateCustomState(fixtureState, inputName);
  return [
    fsValue && typeof fsValue.currentValue === 'number'
      ? fsValue.currentValue
      : defaultValue,
    setValue
  ];
}
