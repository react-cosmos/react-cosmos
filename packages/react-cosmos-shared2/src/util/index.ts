export type StateUpdater<T> = (prevState: T) => T;

export type Message = {
  type: string;
  payload?: {};
};

export { updateItem, replaceOrAddItem, removeItemMatch } from './array';
export { uuid } from './uuid';
