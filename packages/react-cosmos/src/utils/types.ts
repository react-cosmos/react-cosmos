export type StateUpdater<T> = (prevState: T) => T;

export type MessageType = {
  type: string;
  payload?: {};
};
