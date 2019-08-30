import React from 'react';
import { FixtureStateValueType } from 'react-cosmos-shared2/fixtureState';

export type SetValue<T extends FixtureStateValueType> = React.Dispatch<
  React.SetStateAction<T>
>;
