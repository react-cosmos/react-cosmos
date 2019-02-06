// @flow

import { ListIteratee } from 'lodash';

export type StateUpdater<T> = T | ((prevState: T) => T);

export type SetState<T> = (
  updater: StateUpdater<T>,
  callback?: () => unknown
) => unknown;

export declare function updateItem<T>(
  items: Readonly<Array<T>>,
  item: T,
  update: Partial<T>
): Array<T>;

export declare function replaceOrAddItem<T>(
  items: Readonly<Array<T>>,
  matcher: ListIteratee<T>,
  item: T
): Array<T>;

export declare function removeItemMatch<T>(
  items: Readonly<Array<T>>,
  matcher: ListIteratee<T>
): Array<T>;

export declare function removeItem<T>(
  items: Readonly<Array<T>>,
  item: T
): Array<T>;

export declare function updateState<T>(
  prevState: T,
  updater: StateUpdater<T>
): T;

export declare function replaceKeys(
  str: string,
  map: { [key: string]: string }
): string;

export declare function uuid(a?: string): string;
