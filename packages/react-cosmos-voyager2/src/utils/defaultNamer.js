// @flow

const global = {};

/**
 * Generate unique, consecutive default names
 * E.g. default, default (1), default (2), etc.
 */
export function createDefaultNamer(baseName: string) {
  const countPerId: WeakMap<*, number> = new WeakMap();

  return function defaultNamer(id: Object = global): string {
    let count = countPerId.get(id);

    if (count === undefined) {
      count = 0;
      countPerId.set(id, 1);
    } else {
      countPerId.set(id, count + 1);
    }

    return count > 0 ? `${baseName} (${count})` : baseName;
  };
}
