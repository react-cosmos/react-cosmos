// @flow

import type { SetState } from './state';

export type FixtureStateValue = {
  serializable: boolean,
  key: string,
  value: mixed
};

export type FixtureStateValues = FixtureStateValue[];

export type FixtureStateProps = {
  instanceId: number,
  componentName: string,
  renderKey: number,
  values: FixtureStateValues
};

export type FixtureStateState = {
  instanceId: number,
  componentName: string,
  values: FixtureStateValues
};

export type FixtureState = {
  props?: FixtureStateProps[],
  state?: FixtureStateState[],
  [key: string]: mixed
};

export type SetFixtureState = SetState<FixtureState>;
