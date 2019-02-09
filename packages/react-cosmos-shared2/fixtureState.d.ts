// @flow

import { SetState } from './util';

export type KeyValue = { [key: string]: unknown };

export type FixtureRenderKey = number;

export type FixtureDecoratorId = string;

export type FixtureStateValue = {
  serializable: boolean;
  key: string;
  stringified: string;
};

export type FixtureStateValues = FixtureStateValue[];

export type ComponentFixtureState = {
  decoratorId: FixtureDecoratorId;
  elPath: string;
  componentName: string;
  renderKey: FixtureRenderKey;
  props: null | FixtureStateValues;
  state: null | FixtureStateValues;
};

export type FixtureState = {
  components: ComponentFixtureState[];
  [key: string]: any;
};

export type SetFixtureState = SetState<null | FixtureState>;

export declare var DEFAULT_RENDER_KEY: FixtureRenderKey;

export declare function extractValuesFromObj(obj: KeyValue): FixtureStateValues;

export declare function extendObjWithValues(
  obj: KeyValue,
  values: FixtureStateValues
): KeyValue;

export declare function getCompFixtureStates(
  fixtureState: null | FixtureState,
  decoratorId?: FixtureDecoratorId
): ComponentFixtureState[];

export declare function findCompFixtureState(
  fixtureState: null | FixtureState,
  decoratorId: FixtureDecoratorId,
  elPath: string
): null | ComponentFixtureState;

export declare function createCompFixtureState(args: {
  fixtureState: null | FixtureState;
  decoratorId: FixtureDecoratorId;
  elPath: string;
  componentName: string;
  props: null | FixtureStateValues;
  state: null | FixtureStateValues;
}): ComponentFixtureState[];

export declare function updateCompFixtureState(args: {
  fixtureState: null | FixtureState;
  decoratorId: FixtureDecoratorId;
  elPath: string;
  props?: null | FixtureStateValues;
  state?: null | FixtureStateValues;
  resetInstance?: boolean;
}): ComponentFixtureState[];
