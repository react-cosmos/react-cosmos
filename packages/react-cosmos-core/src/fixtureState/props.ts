import { find, isEqual } from 'lodash-es';
import {
  removeItemMatch,
  replaceOrAddItem,
  updateItem,
} from '../utils/array.js';
import {
  PropsFixtureState,
  PropsFixtureStateItem,
  PropsFixtureStateRenderKey,
} from './propsTypes.js';
import {
  FixtureDecoratorId,
  FixtureElementId,
  FixtureStateValues,
} from './types.js';

export const DEFAULT_RENDER_KEY: PropsFixtureStateRenderKey = 0;

export function getFixtureStateProps(
  propsFs: PropsFixtureState | undefined,
  decoratorId: FixtureDecoratorId
): PropsFixtureState {
  return propsFs
    ? propsFs.filter(p => p.elementId.decoratorId === decoratorId)
    : [];
}

export function findFixtureStateProps(
  propsFs: PropsFixtureState | undefined,
  elementId: FixtureElementId
): void | PropsFixtureStateItem {
  return propsFs && find(propsFs, p => isEqual(p.elementId, elementId));
}

type CreateFixtureStatePropsArgs = {
  propsFs: PropsFixtureState | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
  componentName: string;
};
export function createFixtureStateProps({
  propsFs,
  elementId,
  values,
  componentName,
}: CreateFixtureStatePropsArgs) {
  return replaceOrAddItem(propsFs ?? [], createPropsMatcher(elementId), {
    elementId,
    values,
    renderKey: DEFAULT_RENDER_KEY,
    componentName,
  });
}

type ResetFixtureStatePropsArgs = {
  propsFs: PropsFixtureState | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
};
export function resetFixtureStateProps({
  propsFs,
  elementId,
  values,
}: ResetFixtureStatePropsArgs) {
  const propsItem = expectFixtureStateProps(propsFs, elementId);
  return updateItem(propsFs!, propsItem, {
    values,
    renderKey: propsItem.renderKey + 1,
  });
}

type UpdateFixtureStatePropsArgs = {
  propsFs: PropsFixtureState | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
};
export function updateFixtureStateProps({
  propsFs,
  elementId,
  values,
}: UpdateFixtureStatePropsArgs) {
  const propsItem = expectFixtureStateProps(propsFs, elementId);
  return updateItem(propsFs!, propsItem, {
    values,
  });
}

export function removeFixtureStateProps(
  propsFs: PropsFixtureState | undefined,
  elementId: FixtureElementId
) {
  return removeItemMatch(propsFs ?? [], createPropsMatcher(elementId));
}

function createPropsMatcher(elementId: FixtureElementId) {
  return (p: PropsFixtureStateItem) => isEqual(p.elementId, elementId);
}

function expectFixtureStateProps(
  propsFs: PropsFixtureState | undefined,
  elementId: FixtureElementId
): PropsFixtureStateItem {
  const propsItem = findFixtureStateProps(propsFs, elementId);
  if (!propsItem) {
    const elId = JSON.stringify(elementId);
    throw new Error(`Fixture state props missing for element "${elId}"`);
  }
  return propsItem;
}
