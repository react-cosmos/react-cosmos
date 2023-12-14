import { find, isEqual } from 'lodash-es';
import {
  removeItemMatch,
  replaceOrAddItem,
  updateItem,
} from '../utils/array.js';
import {
  FixtureDecoratorId,
  FixtureElementId,
  FixtureStateClassState,
  FixtureStateValues,
} from './types.js';

export function getFixtureStateClassState(
  classStateFs: FixtureStateClassState[] | undefined,
  decoratorId: FixtureDecoratorId
): FixtureStateClassState[] {
  return classStateFs
    ? classStateFs.filter(s => s.elementId.decoratorId === decoratorId)
    : [];
}

export function findFixtureStateClassState(
  classStateFs: FixtureStateClassState[] | undefined,
  elementId: FixtureElementId
): void | FixtureStateClassState {
  return (
    classStateFs && find(classStateFs, s => isEqual(s.elementId, elementId))
  );
}

type CreateFixtureStateClassStateArgs = {
  classStateFs: FixtureStateClassState[] | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
  componentName: string;
};
export function createFixtureStateClassState({
  classStateFs,
  elementId,
  values,
  componentName,
}: CreateFixtureStateClassStateArgs) {
  return replaceOrAddItem(
    classStateFs ?? [],
    createClassStateMatcher(elementId),
    {
      elementId,
      values,
      componentName,
    }
  );
}

type UpdateFixtureStateClassStateArgs = {
  classStateFs: FixtureStateClassState[] | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
};
export function updateFixtureStateClassState({
  classStateFs,
  elementId,
  values,
}: UpdateFixtureStateClassStateArgs) {
  const classStateItem = expectFixtureStateClassState(classStateFs, elementId);
  return updateItem(classStateFs!, classStateItem, {
    values,
  });
}

export function removeFixtureStateClassState(
  classStateFs: FixtureStateClassState[] | undefined,
  elementId: FixtureElementId
) {
  return removeItemMatch(
    classStateFs ?? [],
    createClassStateMatcher(elementId)
  );
}

function createClassStateMatcher(elementId: FixtureElementId) {
  return (p: FixtureStateClassState) => isEqual(p.elementId, elementId);
}

function expectFixtureStateClassState(
  classStateFs: FixtureStateClassState[] | undefined,
  elementId: FixtureElementId
): FixtureStateClassState {
  const classStateItem = findFixtureStateClassState(classStateFs, elementId);
  if (!classStateItem) {
    const elId = JSON.stringify(elementId);
    throw new Error(`Fixture state class state missing for element "${elId}"`);
  }
  return classStateItem;
}
