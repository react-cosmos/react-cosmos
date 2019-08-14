import { usePrimitiveValue } from './shared';

type Args = {
  defaultValue: string;
  inputName: string;
};

export function useString({ defaultValue, inputName }: Args) {
  return usePrimitiveValue(inputName, defaultValue, isString);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}
