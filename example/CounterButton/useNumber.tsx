// TODO: Extract (and test) useNumber into react-cosmos-fixture package
import React from 'react';
import { FixtureContext } from 'react-cosmos-fixture';
import {
  findFixtureStateInputState,
  FixtureStatePrimitiveValue2
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

  const existingInputState = findFixtureStateInputState(
    fixtureState,
    inputName
  );

  // Create fixture state
  React.useEffect(() => {
    setFixtureState(prevFsState => {
      const { inputState = {} } = prevFsState;
      if (inputState[inputName]) {
        const fsInputState = inputState[inputName];
        // FIXME: This only works for primitive values
        if (
          fsInputState.type === 'primitive' &&
          fsInputState.defaultValue === defaultValue
        ) {
          return prevFsState;
        }
      }

      const newInputState: FixtureStatePrimitiveValue2 = {
        type: 'primitive',
        defaultValue,
        currentValue: defaultValue
      };

      return {
        ...prevFsState,
        inputState: {
          ...prevFsState.inputState,
          [inputName]: newInputState
        }
      };
    });
    return () => {
      // TODO: Remove fixture state?
    };
  }, [inputName, defaultValue, fixtureState, setFixtureState]);

  const setValue: SetNumber = React.useCallback(
    // TODO: Refactor (DRY) *after* tests
    stateChange => {
      if (typeof stateChange === 'function') {
        setFixtureState(prevFsState => {
          const prevInputState = findFixtureStateInputState(
            prevFsState,
            inputName
          );

          if (!prevInputState) {
            // TODO: Warn?
            return prevFsState;
          }

          if (typeof prevInputState.currentValue !== 'number') {
            // TODO: Warn?
            return prevFsState;
          }

          const inputState: FixtureStatePrimitiveValue2 = {
            type: 'primitive',
            defaultValue,
            currentValue: stateChange(prevInputState.currentValue)
          };
          return {
            ...prevFsState,
            inputState: {
              ...prevFsState.inputState,
              [inputName]: inputState
            }
          };
        });
      } else {
        setFixtureState(prevFsState => {
          const inputState: FixtureStatePrimitiveValue2 = {
            type: 'primitive',
            defaultValue,
            currentValue: stateChange
          };
          return {
            ...prevFsState,
            inputState: {
              ...prevFsState.inputState,
              [inputName]: inputState
            }
          };
        });
      }
    },
    [defaultValue, inputName, setFixtureState]
  );
  return [
    existingInputState && typeof existingInputState.currentValue === 'number'
      ? existingInputState.currentValue
      : defaultValue,
    setValue
  ];
}
