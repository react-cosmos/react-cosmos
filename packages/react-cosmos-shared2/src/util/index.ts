export type StateUpdater<T> = (prevState: T) => T;

export { updateItem, replaceOrAddItem, removeItemMatch } from './array';
export { uuid } from './uuid';
