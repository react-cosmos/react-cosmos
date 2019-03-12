import { isEqual, find } from 'lodash';
import { isElement } from 'react-is';
import * as reactElementToJSXString from 'react-element-to-jsx-string';
import { updateItem, replaceOrAddItem, SetState } from './util';

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

export const DEFAULT_RENDER_KEY: FixtureRenderKey = 0;

// Why store unserializable values in fixture state?
// - Because they still provides value in the Cosmos UI. They let the user know
//   that, eg. a prop, is present and see the read-only stringified value.
// - More importantly, because the fixture state controls which props to render.
//   This way, if a prop is read-only and cannot be edited in the UI, it can
//   still be removed.
export function extractValuesFromObj(obj: KeyValue): FixtureStateValues {
  return (
    Object.keys(obj)
      // Ignore noise from attrs defined as undefined (eg. props.children is
      // often `undefined` if element has no children)
      .filter(key => obj[key] !== undefined)
      .map(key => stringifyValue(key, obj[key]))
  );
}

// Use fixture state for serializable values and fall back to base values
export function extendObjWithValues(
  obj: KeyValue,
  values: FixtureStateValues
): KeyValue {
  return values.reduce(
    (acc, { serializable, key, stringified }) => ({
      ...acc,
      [key]: serializable ? JSON.parse(stringified) : obj[key]
    }),
    {}
  );
}

export function getCompFixtureStates(
  fixtureState: null | FixtureState,
  decoratorId?: FixtureDecoratorId
): ComponentFixtureState[] {
  if (!fixtureState || !fixtureState.components) {
    return [];
  }

  const { components } = fixtureState;

  if (typeof decoratorId === 'undefined') {
    return components;
  }

  return components.filter(c => c.decoratorId === decoratorId);
}

export function findCompFixtureState(
  fixtureState: null | FixtureState,
  decoratorId: FixtureDecoratorId,
  elPath: string
): void | ComponentFixtureState {
  return find(
    getCompFixtureStates(fixtureState),
    c => c.decoratorId === decoratorId && c.elPath === elPath
  );
}

export function createCompFixtureState({
  fixtureState,
  decoratorId,
  elPath,
  componentName,
  props,
  state
}: {
  fixtureState: null | FixtureState;
  decoratorId: FixtureDecoratorId;
  elPath: string;
  componentName: string;
  props: null | FixtureStateValues;
  state: null | FixtureStateValues;
}): ComponentFixtureState[] {
  return replaceOrAddItem(
    getCompFixtureStates(fixtureState),
    createFxStateMatcher(decoratorId, elPath),
    createCompFxState({ decoratorId, elPath, componentName, props, state })
  );
}

export function updateCompFixtureState({
  fixtureState,
  decoratorId,
  elPath,
  props,
  state,
  resetInstance = false
}: {
  fixtureState: null | FixtureState;
  decoratorId: FixtureDecoratorId;
  elPath: string;
  props?: null | FixtureStateValues;
  state?: null | FixtureStateValues;
  resetInstance?: boolean;
}): ComponentFixtureState[] {
  const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

  if (!compFxState) {
    throw new Error(
      `[fixtureState] Component state not found for decoratorId "${decoratorId}" and elPath "${elPath}"`
    );
  }

  return updateItem(getCompFixtureStates(fixtureState), compFxState, {
    ...compFxState,
    renderKey: resetInstance
      ? compFxState.renderKey + 1
      : compFxState.renderKey,
    props: typeof props !== 'undefined' ? props : compFxState.props,
    state: typeof state !== 'undefined' ? state : compFxState.state
  });
}

function createCompFxState({
  decoratorId,
  elPath,
  componentName,
  props,
  state
}: {
  decoratorId: string;
  elPath: string;
  componentName: string;
  props: null | FixtureStateValues;
  state: null | FixtureStateValues;
}) {
  return {
    decoratorId,
    elPath,
    componentName,
    renderKey: DEFAULT_RENDER_KEY,
    props,
    state
  };
}

function createFxStateMatcher(decoratorId: string, elPath: string) {
  return (s: ComponentFixtureState) =>
    s.decoratorId === decoratorId && s.elPath === elPath;
}

function stringifyValue(key: string, value: unknown): FixtureStateValue {
  try {
    // NOTE: Is this optimal?
    if (!isEqual(JSON.parse(JSON.stringify(value)), value)) {
      throw new Error('Unserializable value');
    }
  } catch (err) {
    return {
      serializable: false,
      key,
      // TODO: Enable custom stringifiers to plug in
      stringified: isElement(value)
        ? reactElementToJSXString(value)
        : String(value)
    };
  }

  return {
    serializable: true,
    key,
    stringified: JSON.stringify(value)
  };
}
