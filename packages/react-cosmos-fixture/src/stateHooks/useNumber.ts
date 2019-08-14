import { usePrimitiveValue } from './shared';

type Args = {
  defaultValue: number;
  inputName: string;
};

export function useNumber({ defaultValue, inputName }: Args) {
  return usePrimitiveValue(inputName, defaultValue, isNumber);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}
