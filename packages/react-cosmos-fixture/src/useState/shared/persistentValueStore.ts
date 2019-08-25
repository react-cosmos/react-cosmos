import { isEqual } from 'lodash';

type PersistentValues = {
  [inputName: string]: {
    defaultValue: unknown;
    currentValue: unknown;
  };
};

let persistedValues: PersistentValues = {};

export function resetPersistentValues() {
  persistedValues = {};
}

export function persistValue({
  inputName,
  defaultValue,
  currentValue
}: {
  inputName: string;
  defaultValue: unknown;
  currentValue: unknown;
}) {
  persistedValues[inputName] = { defaultValue, currentValue };
}

export function getPersistedValue({
  inputName,
  defaultValue
}: {
  inputName: string;
  defaultValue: unknown;
}): unknown {
  const persistedValue = persistedValues[inputName];
  return persistedValue && isEqual(persistedValue.defaultValue, defaultValue)
    ? persistedValue.currentValue
    : defaultValue;
}
