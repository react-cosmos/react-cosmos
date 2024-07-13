import { Dispatch, SetStateAction } from 'react-cosmos-core';
import { useFixtureInput } from './useFixtureInput.js';

type Opts<T> = {
  defaultValue: T;
};

// NOTE: This is an alias for useFixtureInput kept for backwards compatibility
// with Cosmos versions older than 6.1
export function useValue<T>(
  inputName: string,
  opts: Opts<T>
): [T, Dispatch<SetStateAction<T>>] {
  return useFixtureInput(inputName, opts.defaultValue);
}
