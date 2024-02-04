import { FixtureStateValue } from './types.js';

export type StandardControlFixtureState = {
  type: 'standard';
  defaultValue: FixtureStateValue;
  currentValue: FixtureStateValue;
};

export type SelectControlFixtureState = {
  type: 'select';
  options: string[] | { group: string; options: string[] }[];
  defaultValue: string;
  currentValue: string;
};

export type ControlFixtureState =
  | StandardControlFixtureState
  | SelectControlFixtureState;

export type ControlsFixtureState = Record<string, ControlFixtureState>;
