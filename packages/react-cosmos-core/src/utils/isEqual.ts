export function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  if (
    a === null ||
    b === null ||
    typeof a !== 'object' ||
    typeof b !== 'object'
  )
    return false;

  if (a instanceof Date)
    return b instanceof Date && a.getTime() === b.getTime();

  if (a instanceof RegExp)
    return b instanceof RegExp && a.source === b.source && a.flags === b.flags;

  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!b.has(key) || !isEqual(val, b.get(key))) return false;
    }
    return true;
  }

  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) return false;
    for (const val of a) {
      if (!b.has(val)) return false;
    }
    return true;
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((val, i) => isEqual(val, b[i]));
  }
  if (Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    key =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
  );
}
