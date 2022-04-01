import React from 'react';
import { FixtureStateData } from '../../core/fixtureState/types';

export type SetValue<T extends FixtureStateData> = React.Dispatch<
  React.SetStateAction<T>
>;
