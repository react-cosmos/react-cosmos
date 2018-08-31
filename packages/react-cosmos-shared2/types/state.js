// @flow

export type StateUpdater<T> = $Shape<T> | ((prevState: ?T) => $Shape<T>);

export type SetState<T> = (
  updater: StateUpdater<T>,
  callback?: () => mixed
) => mixed;
