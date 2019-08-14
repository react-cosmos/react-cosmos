import { usePrimitiveValue } from './shared';

type Args = {
  defaultValue: boolean;
  inputName: string;
};

export function useBoolean({ defaultValue, inputName }: Args) {
  return usePrimitiveValue(inputName, defaultValue, isBoolean);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}
