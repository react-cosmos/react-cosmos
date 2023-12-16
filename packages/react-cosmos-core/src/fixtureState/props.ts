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

export function filterPropsFixtureState(
  propsFs: PropsFixtureState | undefined,
  decoratorId: FixtureDecoratorId
): PropsFixtureState {
  return propsFs
    ? propsFs.filter(p => p.elementId.decoratorId === decoratorId)
    : [];
}

export function findPropsFixtureStateItem(
  propsFs: PropsFixtureState | undefined,
  elementId: FixtureElementId
): void | PropsFixtureStateItem {
  return propsFs && find(propsFs, p => isEqual(p.elementId, elementId));
}

type CreatePropsFixtureStateArgs = {
  propsFs: PropsFixtureState | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
  componentName: string;
};
export function createPropsFixtureStateItem({
  propsFs,
  elementId,
  values,
  componentName,
}: CreatePropsFixtureStateArgs) {
  return replaceOrAddItem(propsFs ?? [], createPropsMatcher(elementId), {
    elementId,
    values,
    renderKey: DEFAULT_RENDER_KEY,
    componentName,
  });
}

type ResetPropsFixtureStateItemArgs = {
  propsFs: PropsFixtureState | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
};
export function resetPropsFixtureStateItem({
  propsFs,
  elementId,
  values,
}: ResetPropsFixtureStateItemArgs) {
  const item = expectPropsItem(propsFs, elementId);
  return updateItem(propsFs!, item, {
    values,
    renderKey: item.renderKey + 1,
  });
}

type UpdatePropsFixtureStateItemArgs = {
  propsFs: PropsFixtureState | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
};
export function updatePropsFixtureStateItem({
  propsFs,
  elementId,
  values,
}: UpdatePropsFixtureStateItemArgs) {
  const item = expectPropsItem(propsFs, elementId);
  return updateItem(propsFs!, item, { values });
}

export function removePropsFixtureStateItem(
  propsFs: PropsFixtureState | undefined,
  elementId: FixtureElementId
) {
  return removeItemMatch(propsFs ?? [], createPropsMatcher(elementId));
}

function createPropsMatcher(elementId: FixtureElementId) {
  return (p: PropsFixtureStateItem) => isEqual(p.elementId, elementId);
}

function expectPropsItem(
  propsFs: PropsFixtureState | undefined,
  elementId: FixtureElementId
): PropsFixtureStateItem {
  const item = findPropsFixtureStateItem(propsFs, elementId);
  if (!item) {
    const elId = JSON.stringify(elementId);
    throw new Error(`Fixture state props missing for element "${elId}"`);
  }
  return item;
}
