import { find, isEqual } from 'lodash-es';
import {
  removeItemMatch,
  replaceOrAddItem,
  updateItem,
} from '../utils/array.js';
import {
  FixtureDecoratorId,
  FixtureElementId,
  FixtureRenderKey,
  FixtureStateProps,
  FixtureStateValues,
} from './types.js';

export const DEFAULT_RENDER_KEY: FixtureRenderKey = 0;

export function getFixtureStateProps(
  propsFs: FixtureStateProps[] | undefined,
  decoratorId: FixtureDecoratorId
): FixtureStateProps[] {
  return propsFs
    ? propsFs.filter(p => p.elementId.decoratorId === decoratorId)
    : [];
}

export function findFixtureStateProps(
  propsFs: FixtureStateProps[] | undefined,
  elementId: FixtureElementId
): void | FixtureStateProps {
  return propsFs && find(propsFs, p => isEqual(p.elementId, elementId));
}

type CreateFixtureStatePropsArgs = {
  propsFs: FixtureStateProps[] | undefined;
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
  propsFs: FixtureStateProps[] | undefined;
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
  propsFs: FixtureStateProps[] | undefined;
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
  propsFs: FixtureStateProps[] | undefined,
  elementId: FixtureElementId
) {
  return removeItemMatch(propsFs ?? [], createPropsMatcher(elementId));
}

function createPropsMatcher(elementId: FixtureElementId) {
  return (p: FixtureStateProps) => isEqual(p.elementId, elementId);
}

function expectFixtureStateProps(
  propsFs: FixtureStateProps[] | undefined,
  elementId: FixtureElementId
): FixtureStateProps {
  const propsItem = findFixtureStateProps(propsFs, elementId);
  if (!propsItem) {
    const elId = JSON.stringify(elementId);
    throw new Error(`Fixture state props missing for element "${elId}"`);
  }
  return propsItem;
}
