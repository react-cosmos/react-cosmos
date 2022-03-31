import React from 'react';
import { FixtureStateData } from '../../utils/fixtureState/types';

export type SetValue<T extends FixtureStateData> = React.Dispatch<
  React.SetStateAction<T>
>;
