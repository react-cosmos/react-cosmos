// TODO: Extract (and test) useNumber into react-cosmos-fixture package
import React from 'react';
import { isEqual, omit } from 'lodash';
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

  useCleanFixtureState(inputName);

  // Create fixture state
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

function useCleanFixtureState(inputName: string) {
  const { setFixtureState } = React.useContext(FixtureContext);
  const prevInputName = React.useRef<string>(inputName);
  React.useEffect(() => {
    prevInputName.current = inputName;
    return () => {
      setFixtureState(prevFsState => ({
        ...prevFsState,
        customState: omit(prevFsState.customState || {}, prevInputName.current)
      }));
    };
  }, [inputName, setFixtureState]);
}
