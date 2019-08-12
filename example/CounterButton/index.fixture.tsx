import React from 'react';
import { FixtureContext } from 'react-cosmos-fixture';
import {
  findFixtureStateInputState,
  FixtureStateInputState
} from 'react-cosmos-shared2/fixtureState';
import { CounterButton } from '.';

export default () => {
  const [count, setCount] = useNumber({ inputName: 'count', defaultValue: 0 });
  return (
    <CounterButton
      suffix="times"
      count={count}
      increment={() => setCount(prevCount => prevCount + 1)}
      // increment={() => setCount(count + 1)}
    />
  );
};

// TODO: Extract (and test) useNumber into react-cosmos-fixture package

type UseNumberArgs = {
  defaultValue: number;
  inputName: string;
};

type NumberInputState = FixtureStateInputState<number>;

type SetNumber = React.Dispatch<React.SetStateAction<number>>;

function useNumber({
  defaultValue,
  inputName
}: UseNumberArgs): [number, SetNumber] {
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);

  const { value } = findFixtureStateInputState<number>(
    fixtureState,
    inputName,
    defaultValue
  );

  const setValue: SetNumber = React.useCallback(
    // TODO: Refactor (DRY) *after* tests
    stateChange => {
      if (typeof stateChange === 'function') {
        setFixtureState(prevFsState => {
          const prevInputState = findFixtureStateInputState<number>(
            prevFsState,
            inputName,
            defaultValue
          );
          const inputState: NumberInputState = {
            defaultValue,
            value: stateChange(prevInputState.value)
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
          const inputState: NumberInputState = {
            defaultValue,
            value: stateChange
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

  return [value, setValue];
}
