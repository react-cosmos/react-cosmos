// @flow

/**
 * Generate unique, consecutive default names
 * E.g. default, default (1), default (2), etc.
 */
export function createDefaultNamer(baseName: string) {
  const countPerId: WeakMap<mixed, number> = new WeakMap();
  const defaultId = {};

  function getPrevCount(id: mixed): number {
    const count = countPerId.get(id);

    return typeof count === 'number' ? count : 0;
  }

  return function defaultNamer(id: mixed = defaultId): string {
    const count = getPrevCount(id);

    countPerId.set(id, count + 1);

    return count > 0 ? `${baseName} ${count}` : baseName;
  };
}
