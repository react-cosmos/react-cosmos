import { useValue } from './useValue.js';

// TODO: Make this the primary implementation and deprecate useValue
export function useInput<T>(
  inputName: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  return useValue(inputName, { defaultValue });
}
