import {
  useCleanFixtureStateValue,
  useSetValue,
  useSyncFixtureStateValue,
  useValue,
  UseValueReturn
} from './shared';

type Args = {
  defaultValue: boolean;
  inputName: string;
};

export function useBoolean({
  defaultValue,
  inputName
}: Args): UseValueReturn<boolean> {
  useSyncFixtureStateValue(inputName, defaultValue);
  useCleanFixtureStateValue(inputName);
  const value = useValue(inputName, defaultValue, isBoolean);
  const setValue = useSetValue(inputName, defaultValue, isBoolean);
  return [value, setValue];
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}
