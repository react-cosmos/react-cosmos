import { FixtureStatePrimitiveValueType } from 'react-cosmos-shared2/fixtureState';
import { IsType } from './shared';

type PersistedValue<Value extends FixtureStatePrimitiveValueType> = {
  defaultValue: Value;
  currentValue: Value;
};

type PersistentValues = {
  [inputName: string]: PersistedValue<any>;
};

let persistedValues: PersistentValues = {};

export function resetPersistentValues() {
  persistedValues = {};
}

export function persistValue<Value extends FixtureStatePrimitiveValueType>({
  inputName,
  defaultValue,
  currentValue
}: {
  inputName: string;
  defaultValue: Value;
  currentValue: Value;
}) {
  persistedValues[inputName] = { defaultValue, currentValue };
}

export function getPersistedValue<
  Value extends FixtureStatePrimitiveValueType
>({
  inputName,
  defaultValue,
  isType
}: {
  inputName: string;
  defaultValue: Value;
  isType: IsType<Value>;
}): Value {
  const persistedValue = persistedValues[inputName];
  return persistedValue &&
    isType(persistedValue.currentValue) &&
    persistedValue.defaultValue === defaultValue
    ? persistedValue.currentValue
    : defaultValue;
}
