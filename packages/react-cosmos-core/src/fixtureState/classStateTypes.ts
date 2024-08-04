import { FixtureElementId, FixtureStateValues } from './types.js';

export type ClassStateFixtureStateItem = {
  elementId: FixtureElementId;
  values: FixtureStateValues;
  componentName: string;
};

export type ClassStateFixtureState = ClassStateFixtureStateItem[];
