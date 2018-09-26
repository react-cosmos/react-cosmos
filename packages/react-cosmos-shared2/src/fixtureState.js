// @flow

import { isEqual } from 'lodash';
import { isElement } from 'react-is';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { updateItem } from './util';

import type {
  FixtureDecoratorId,
  FixtureStateValue,
  FixtureStateValues,
  PropsFixtureState,
  StateFixtureState,
  FixtureState
} from './fixtureState.js.flow';

// Why store unserializable values in fixture state?
// - Because they still provides value in the Cosmos UI. They let the user know
//   that, eg. a prop, is present and see the read-only stringified value.
// - More importantly, because the fixture state controls which props to render.
//   This way, if a prop is read-only and cannot be edited in the UI, it can
//   still be removed.
export function extractValuesFromObject(obj: {
  [string]: mixed
}): FixtureStateValues {
  return (
    Object.keys(obj)
      // Ignore noise from attrs defined as undefined (eg. props.children is
      // often `undefined` if element has no children)
      .filter(key => obj[key] !== undefined)
      .map(key => stringifyValue(key, obj[key]))
  );
}

export function getPropsFixtureState(
  fixtureState: ?FixtureState,
  matcher?: PropsFixtureState => boolean
) {
  if (!fixtureState || !fixtureState.props) {
    return [];
  }

  return matcher ? fixtureState.props.filter(matcher) : fixtureState.props;
}

export function updatePropsFixtureState({
  fixtureState,
  decoratorId,
  elPath,
  values,
  resetInstance = false
}: {
  fixtureState: ?FixtureState,
  decoratorId: FixtureDecoratorId,
  elPath: string,
  values: FixtureStateValues,
  resetInstance?: boolean
}) {
  const [propsFxState] = getPropsFixtureState(
    fixtureState,
    i => i.decoratorId === decoratorId && i.elPath === elPath
  );

  if (!propsFxState) {
    throw new Error(
      `No props fixture state with decoratorId '${decoratorId}' and elPath '${elPath}'`
    );
  }

  const { renderKey } = propsFxState;

  return updateItem(getPropsFixtureState(fixtureState), propsFxState, {
    renderKey: resetInstance ? renderKey + 1 : renderKey,
    values
  });
}

export function getStateFixtureState(
  fixtureState: ?FixtureState,
  matcher?: StateFixtureState => boolean
) {
  if (!fixtureState || !fixtureState.state) {
    return [];
  }

  return matcher ? fixtureState.state.filter(matcher) : fixtureState.state;
}

export function updateStateFixtureState({
  fixtureState,
  decoratorId,
  elPath,
  values
}: {
  fixtureState: ?FixtureState,
  decoratorId: FixtureDecoratorId,
  elPath: string,
  values: FixtureStateValues
}) {
  const [stateFxState] = getStateFixtureState(
    fixtureState,
    i => i.decoratorId === decoratorId && i.elPath === elPath
  );

  if (!stateFxState) {
    throw new Error(
      `No state fixture state with decoratorId '${decoratorId}' and elPath '${elPath}'`
    );
  }

  return updateItem(getStateFixtureState(fixtureState), stateFxState, {
    values
  });
}

export function createFxStateMatcher(decoratorId: FixtureDecoratorId) {
  return (fxState: { decoratorId: FixtureDecoratorId }) =>
    fxState.decoratorId === decoratorId;
}

export function createElFxStateMatcher(
  decoratorId: FixtureDecoratorId,
  elPath: string
) {
  return (fxState: { decoratorId: FixtureDecoratorId, elPath: string }) =>
    fxState.decoratorId === decoratorId && fxState.elPath === elPath;
}

function stringifyValue(key: string, value: mixed): FixtureStateValue {
  try {
    // XXX: Is this optimal?
    if (!isEqual(JSON.parse(JSON.stringify(value)), value)) {
      throw new Error('Unserializable value');
    }
  } catch (err) {
    return {
      serializable: false,
      key,
      // TODO: Enable custom stringifiers to plug in
      stringified: isElement(value)
        ? // $FlowFixMe No static way to show that value is React.Element
          reactElementToJSXString(value)
        : String(value)
    };
  }

  return {
    serializable: true,
    key,
    stringified: JSON.stringify(value)
  };
}
