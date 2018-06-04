// @flow

type ReduxState = Object;

export type Unsubscribe = () => void;

export type ReduxStore = {
  getState(): ReduxState,
  subscribe(listener: () => void): Unsubscribe
};

export type ReduxStoreCreator = (initialState: ReduxState) => ReduxStore;
