import { usePrimitiveValue } from './shared/usePrimitiveValue';

type Opts = {
  defaultValue?: boolean;
};

export function useBoolean(
  inputName: string,
  { defaultValue = false }: Opts = {}
) {
  return usePrimitiveValue(inputName, defaultValue, isBoolean);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}
