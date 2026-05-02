/**
 * Deep equality for the subset of values that appear in react-cosmos
 * fixture state, props, and element IDs.
 *
 * Handles: primitives (NaN and +0/-0 are treated as equal), Date, RegExp,
 * Map, Set, arrays, and plain objects (enumerable own keys only).
 *
 * Not handled — do not rely on correct results for these:
 * - Circular references (will stack overflow).
 * - Sets containing non-primitives (compared by identity, not structure).
 * - Symbol-keyed properties (ignored).
 * - TypedArrays / ArrayBuffer / Error / arguments objects (fall through
 *   to the plain-object branch).
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b || (Number.isNaN(a) && Number.isNaN(b))) return true;

  if (
    a === null ||
    b === null ||
    typeof a !== 'object' ||
    typeof b !== 'object'
  )
    return false;

  if (a.constructor !== b.constructor) return false;

  if (a instanceof Date) return a.getTime() === (b as Date).getTime();

  if (a instanceof RegExp)
    return a.source === (b as RegExp).source && a.flags === (b as RegExp).flags;

  if (a instanceof Map) {
    const mb = b as Map<unknown, unknown>;
    if (a.size !== mb.size) return false;
    for (const [key, val] of a) {
      if (!mb.has(key) || !isEqual(val, mb.get(key))) return false;
    }
    return true;
  }

  if (a instanceof Set) {
    const sb = b as Set<unknown>;
    if (a.size !== sb.size) return false;
    for (const val of a) {
      if (!sb.has(val)) return false;
    }
    return true;
  }

  if (Array.isArray(a)) {
    const arrB = b as unknown[];
    if (a.length !== arrB.length) return false;
    return a.every((val, i) => isEqual(val, arrB[i]));
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    key =>
      Object.hasOwn(b, key) &&
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
  );
}
