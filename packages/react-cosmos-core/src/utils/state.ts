export type StateUpdater<T> = (prevState: T) => T;

export type HybridStateUpdater<T> = T | ((prevState: T) => T);

export function hybridStateUpdater<T>(
  prev: T | undefined,
  update: HybridStateUpdater<T | undefined>
) {
  return isCallbackUpdate(update) ? update(prev) : update;
}

function isCallbackUpdate<T>(
  updater: HybridStateUpdater<T>
): updater is (prevState: T) => T {
  return typeof updater === 'function';
}
