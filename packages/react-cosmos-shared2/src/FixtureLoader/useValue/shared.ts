import React from 'react';
import { FixtureStateValueType } from '../../fixtureState';

export type SetValue<T extends FixtureStateValueType> = React.Dispatch<
  React.SetStateAction<T>
>;
