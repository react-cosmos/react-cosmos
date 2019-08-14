import {
  useCleanFixtureStateValue,
  useSetValue,
  useSyncFixtureStateValue,
  useValue,
  UseValueReturn
} from './shared';

type Args = {
  defaultValue: string;
  inputName: string;
};

export function useString({
  defaultValue,
  inputName
}: Args): UseValueReturn<string> {
  useSyncFixtureStateValue(inputName, defaultValue);
  useCleanFixtureStateValue(inputName);
  const value = useValue(inputName, defaultValue, isString);
  const setValue = useSetValue(inputName, defaultValue, isString);
  return [value, setValue];
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}
