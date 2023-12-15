import { FixtureElementId, FixtureStateValues } from './types.js';

export type PropsFixtureStateRenderKey = number;

export type PropsFixtureStateItem = {
  elementId: FixtureElementId;
  values: FixtureStateValues;
  renderKey: PropsFixtureStateRenderKey;
  componentName: string;
};

export type PropsFixtureState = PropsFixtureStateItem[];
