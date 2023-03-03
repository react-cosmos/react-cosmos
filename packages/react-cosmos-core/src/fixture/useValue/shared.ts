import React from 'react';
import { FixtureStateData } from '../../fixtureState/types.js';

export type SetValue<T extends FixtureStateData> = React.Dispatch<
  React.SetStateAction<T>
>;
