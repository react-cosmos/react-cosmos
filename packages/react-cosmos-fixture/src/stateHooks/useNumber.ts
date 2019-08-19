import { usePrimitiveValue } from './shared/usePrimitiveValue';

type Opts = {
  defaultValue?: number;
};

export function useNumber(inputName: string, { defaultValue = 0 }: Opts = {}) {
  return usePrimitiveValue(inputName, defaultValue, isNumber);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}
