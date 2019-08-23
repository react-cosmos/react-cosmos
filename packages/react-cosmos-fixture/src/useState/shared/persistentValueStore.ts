import { isEqual } from 'lodash';
import { FixtureStateValueType } from 'react-cosmos-shared2/fixtureState';

type PersistentValues = {
  [inputName: string]: {
    defaultValue: FixtureStateValueType;
    currentValue: FixtureStateValueType;
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
  defaultValue: FixtureStateValueType;
  currentValue: FixtureStateValueType;
}) {
  persistedValues[inputName] = { defaultValue, currentValue };
}

export function getPersistedValue({
  inputName,
  defaultValue
}: {
  inputName: string;
  defaultValue: FixtureStateValueType;
}): FixtureStateValueType {
  const persistedValue = persistedValues[inputName];
  return persistedValue && isEqual(persistedValue.defaultValue, defaultValue)
    ? persistedValue.currentValue
    : defaultValue;
}
