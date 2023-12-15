export type StateUpdater<T> = (prevState: T) => T;

export type HybridStateChange<T> = T | ((prevState: T) => T);

export function applyStateChange<T>(prev: T, change: HybridStateChange<T>) {
  return isStateUpdater(change) ? change(prev) : change;
}

function isStateUpdater<T>(
  change: HybridStateChange<T>
): change is (prevState: T) => T {
  return typeof change === 'function';
}
