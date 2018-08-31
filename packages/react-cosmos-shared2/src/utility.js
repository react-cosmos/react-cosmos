// @flow

import { findIndex } from 'lodash';

import type { Predicate } from 'lodash';

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
  items: $ReadOnlyArray<T> = [],
  matcher: Predicate<T>,
  item: T
): Array<T> {
  const index = findIndex(items, matcher);

  return index !== -1
    ? [...items.slice(0, index), item, ...items.slice(index + 1)]
    : [...items, item];
}

export function removeItem<T>(
  items: $ReadOnlyArray<T> = [],
  item: T
): Array<T> {
  const index = items.indexOf(item);

  if (index === -1) {
    throw new Error(`Trying to remove missing list item`);
  }

  return [...items.slice(0, index), ...items.slice(index + 1)];
}
