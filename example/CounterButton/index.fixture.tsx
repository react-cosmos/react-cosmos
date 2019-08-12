import React from 'react';
import { FixtureContext } from 'react-cosmos-fixture';
import {
  findFixtureStateInputState,
  FixtureStatePrimitiveValue,
  FixtureStateInputState
} from 'react-cosmos-shared2/fixtureState';
import { CounterButton } from '.';

export default () => {
  const [count, setCount] = useNumber({
    inputName: 'count',
    defaultValue: 24
  });
  return (
    <CounterButton
      suffix="times"
      count={count}
      increment={() => setCount(prevCount => prevCount + 1)}
      // TODO: Test this as well: increment={() => setCount(count + 1)}
    />
  );
};

// TODO: Extract (and test) useNumber into react-cosmos-fixture package

type UseNumberArgs = {
  defaultValue: number;
  inputName: string;
};

type SetNumber = React.Dispatch<React.SetStateAction<number>>;

function useNumber({
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
          fsInputState.defaultValue.type === 'primitive' &&
          fsInputState.defaultValue.value === defaultValue
        ) {
          return prevFsState;
        }
      }

      const newInputState: FixtureStateInputState<
        FixtureStatePrimitiveValue
      > = {
        defaultValue: {
          type: 'primitive',
          value: defaultValue
        },
        currentValue: {
          type: 'primitive',
          value: defaultValue
        }
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

          if (typeof prevInputState.currentValue.value !== 'number') {
            // TODO: Warn?
            return prevFsState;
          }

          const inputState: FixtureStateInputState<
            FixtureStatePrimitiveValue
          > = {
            defaultValue: {
              type: 'primitive',
              value: defaultValue
            },
            currentValue: {
              type: 'primitive',
              value: stateChange(prevInputState.currentValue.value)
            }
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
          const inputState: FixtureStateInputState<
            FixtureStatePrimitiveValue
          > = {
            defaultValue: {
              type: 'primitive',
              value: defaultValue
            },
            currentValue: {
              type: 'primitive',
              value: stateChange
            }
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
    existingInputState &&
    typeof existingInputState.currentValue.value === 'number'
      ? existingInputState.currentValue.value
      : defaultValue,
    setValue
  ];
}
