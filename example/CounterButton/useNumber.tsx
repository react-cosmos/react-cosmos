// TODO: Extract (and test) useNumber into react-cosmos-fixture package
import React from 'react';
import { isEqual, omit } from 'lodash';
import { FixtureContext } from 'react-cosmos-fixture';
import { findFixtureStateCustomState } from 'react-cosmos-shared2/fixtureState';

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

  useCleanFixtureStateOnInputRename(inputName);
  useCreateOrResetFixtureState(inputName, defaultValue);

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

          return {
            ...prevFsState,
            customState: {
              ...prevFsState.customState,
              [inputName]: {
                type: 'primitive',
                defaultValue,
                currentValue: stateChange(prevFsValue.currentValue)
              }
            }
          };
        });
      } else {
        setFixtureState(prevFsState => {
          return {
            ...prevFsState,
            customState: {
              ...prevFsState.customState,
              [inputName]: {
                type: 'primitive',
                defaultValue,
                currentValue: stateChange
              }
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

function useCleanFixtureStateOnInputRename(inputName: string) {
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

function useCreateOrResetFixtureState(inputName: string, defaultValue: number) {
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
