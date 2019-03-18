import { findIndex } from 'lodash';

export type StateUpdater<T> = (prevState: T) => T;

export type SetStateAsync<StateUpdate> = (
  update: StateUpdate,
  callback?: () => unknown
) => unknown;

export function updateItem<T>(
  items: Readonly<T[]>,
  item: T,
  update: Partial<T>
): T[] {
  const index = items.indexOf(item);

  return [
    ...items.slice(0, index),
    { ...item, ...update },
    ...items.slice(index + 1)
  ];
}

export function replaceOrAddItem<T>(
  items: Readonly<T[]>,
  matcher: (item: T) => boolean,
  item: T
): T[] {
  const index = findIndex(items, matcher);

  return index !== -1
    ? [...items.slice(0, index), item, ...items.slice(index + 1)]
    : [...items, item];
}

export function removeItemMatch<T>(
  items: Readonly<T[]>,
  matcher: (item: T) => boolean
): T[] {
  const index = findIndex(items, matcher);

  return index === -1
    ? [...items]
    : [...items.slice(0, index), ...items.slice(index + 1)];
}

export function removeItem<T>(items: Readonly<T[]>, item: T): T[] {
  const index = items.indexOf(item);

  if (index === -1) {
    throw new Error(`Trying to remove missing list item`);
  }

  return [...items.slice(0, index), ...items.slice(index + 1)];
}

export function replaceKeys(str: string, map: { [key: string]: string }) {
  return Object.keys(map).reduce((res, key) => res.replace(key, map[key]), str);
}

export { uuid } from './uuid';
