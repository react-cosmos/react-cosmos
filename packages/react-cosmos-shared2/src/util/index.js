// @flow

import { findIndex } from 'lodash';

import type { Predicate } from 'lodash';
import type { StateUpdater } from './index.js.flow';

export function updateItem<T>(
  items: $ReadOnlyArray<T>,
  item: T,
  update: $Shape<T>
): Array<T> {
  const index = items.indexOf(item);

  return [
    ...items.slice(0, index),
    { ...item, ...update },
    ...items.slice(index + 1)
  ];
}

export function replaceOrAddItem<T>(
  items: $ReadOnlyArray<T>,
  matcher: Predicate<T>,
  item: T
): Array<T> {
  const index = findIndex(items, matcher);

  return index !== -1
    ? [...items.slice(0, index), item, ...items.slice(index + 1)]
    : [...items, item];
}

export function removeItemMatch<T>(
  items: $ReadOnlyArray<T>,
  matcher: Predicate<T>
): Array<T> {
  const index = findIndex(items, matcher);

  return index === -1
    ? [...items]
    : [...items.slice(0, index), ...items.slice(index + 1)];
}

export function removeItem<T>(items: $ReadOnlyArray<T>, item: T): Array<T> {
  const index = items.indexOf(item);

  if (index === -1) {
    throw new Error(`Trying to remove missing list item`);
  }

  return [...items.slice(0, index), ...items.slice(index + 1)];
}

export function updateState<T>(prevState: T, updater: StateUpdater<T>): T {
  const fixtureChange =
    typeof updater === 'function' ? updater(prevState) : updater;

  return {
    ...prevState,
    ...fixtureChange
  };
}

export function replaceState<T>(prevState: T, updater: StateUpdater<T>): T {
  return typeof updater === 'function' ? updater(prevState) : updater;
}

export function replaceKeys(str: string, map: { [key: string]: string }) {
  return Object.keys(map).reduce((res, key) => res.replace(key, map[key]), str);
}

export { uuid } from './uuid';
