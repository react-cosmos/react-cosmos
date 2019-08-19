import { FixtureStatePrimitiveValueType } from 'react-cosmos-shared2/fixtureState';

export type IsType<Value extends FixtureStatePrimitiveValueType> = (
  value: unknown
) => value is Value;
