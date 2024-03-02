import { useValue } from '../useValue/useValue.js';

export function useCosmosInput<T>(
  inputName: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  return useValue(inputName, { defaultValue });
}
