import { find, isEqual } from 'lodash-es';
import {
  removeItemMatch,
  replaceOrAddItem,
  updateItem,
} from '../utils/array.js';
import {
  ClassStateFixtureState,
  ClassStateFixtureStateItem,
} from './classStateTypes.js';
import {
  FixtureDecoratorId,
  FixtureElementId,
  FixtureStateValues,
} from './types.js';

export function filterClassStateFixtureState(
  classStateFs: ClassStateFixtureState | undefined,
  decoratorId: FixtureDecoratorId
): ClassStateFixtureState {
  return classStateFs
    ? classStateFs.filter(s => s.elementId.decoratorId === decoratorId)
    : [];
}

export function findClassStateFixtureStateItem(
  classStateFs: ClassStateFixtureState | undefined,
  elementId: FixtureElementId
): void | ClassStateFixtureStateItem {
  return (
    classStateFs && find(classStateFs, s => isEqual(s.elementId, elementId))
  );
}

type CreateClassStateFixtureStateArgs = {
  classStateFs: ClassStateFixtureState | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
  componentName: string;
};
export function createClassStateFixtureStateItem({
  classStateFs,
  elementId,
  values,
  componentName,
}: CreateClassStateFixtureStateArgs) {
  return replaceOrAddItem(
    classStateFs ?? [],
    createClassStateMatcher(elementId),
    { elementId, values, componentName }
  );
}

type UpdateClassStateFixtureStateArgs = {
  classStateFs: ClassStateFixtureState | undefined;
  elementId: FixtureElementId;
  values: FixtureStateValues;
};
export function updateClassStateFixtureStateItem({
  classStateFs,
  elementId,
  values,
}: UpdateClassStateFixtureStateArgs) {
  const item = expectClassStateItem(classStateFs, elementId);
  return updateItem(classStateFs!, item, { values });
}

export function removeClassStateFixtureStateItem(
  classStateFs: ClassStateFixtureState | undefined,
  elementId: FixtureElementId
) {
  return removeItemMatch(
    classStateFs ?? [],
    createClassStateMatcher(elementId)
  );
}

function createClassStateMatcher(elementId: FixtureElementId) {
  return (p: ClassStateFixtureStateItem) => isEqual(p.elementId, elementId);
}

function expectClassStateItem(
  classStateFs: ClassStateFixtureState | undefined,
  elementId: FixtureElementId
): ClassStateFixtureStateItem {
  const item = findClassStateFixtureStateItem(classStateFs, elementId);
  if (!item) {
    const elId = JSON.stringify(elementId);
    throw new Error(`Fixture state class state missing for element "${elId}"`);
  }
  return item;
}
