import React from 'react';
import { FixtureStateData } from '../../core/fixtureState/types.js';

export type SetValue<T extends FixtureStateData> = React.Dispatch<
  React.SetStateAction<T>
>;
