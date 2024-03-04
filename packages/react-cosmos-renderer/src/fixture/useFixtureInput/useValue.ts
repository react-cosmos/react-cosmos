import { useFixtureInput } from './useFixtureInput.js';

type Opts<T> = {
  defaultValue: T;
};

// NOTE: This is an alias for useInput kept for backwards compatibility with
// Cosmos versions older than 6.1
export function useValue<T>(
  inputName: string,
  opts: Opts<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  return useFixtureInput(inputName, opts.defaultValue);
}
