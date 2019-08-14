import {
  useCleanFixtureStateValue,
  useSetValue,
  useSyncFixtureStateValue,
  useValue,
  UseValueReturn
} from './shared';

type Args = {
  defaultValue: number;
  inputName: string;
};

export function useNumber({
  defaultValue,
  inputName
}: Args): UseValueReturn<number> {
  useSyncFixtureStateValue(inputName, defaultValue);
  useCleanFixtureStateValue(inputName);
  const value = useValue(inputName, defaultValue, isNumber);
  const setValue = useSetValue(inputName, defaultValue, isNumber);
  return [value, setValue];
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}
