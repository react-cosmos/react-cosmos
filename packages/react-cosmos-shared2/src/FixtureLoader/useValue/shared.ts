import React from 'react';
import { FixtureStateValueData } from '../../fixtureState';

export type SetValue<T extends FixtureStateValueData> = React.Dispatch<
  React.SetStateAction<T>
>;
