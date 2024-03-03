import { FixtureStateValue } from './types.js';

export type StandardInputFixtureState = {
  type: 'standard';
  defaultValue: FixtureStateValue;
  currentValue: FixtureStateValue;
};

export type SelectInputFixtureState = {
  type: 'select';
  options: string[] | { group: string; options: string[] }[];
  defaultValue: string;
  currentValue: string;
};

export type InputFixtureState =
  | StandardInputFixtureState
  | SelectInputFixtureState;

export type InputsFixtureState = Record<string, InputFixtureState>;
