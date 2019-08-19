import { usePrimitiveValue } from './shared/getPrimitiveValue';

type Opts = {
  defaultValue?: string;
};

export function useString(inputName: string, { defaultValue = '' }: Opts = {}) {
  return usePrimitiveValue(inputName, defaultValue, isString);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}
