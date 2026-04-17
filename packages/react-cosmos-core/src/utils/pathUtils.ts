type Indexable = Record<string | number, unknown>;

export function getByPath<T extends object>(obj: T, path: string): unknown {
  let cur: unknown = obj;
  for (const key of parsePath(path)) {
    if (cur === null || cur === undefined) return undefined;
    cur = (cur as Indexable)[key];
  }
  return cur;
}

export function setByPath<T extends object>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = parsePath(path);

  function set(current: unknown, index: number): unknown {
    if (index === keys.length) return value;

    const key = keys[index];
    const cur = current as Indexable | undefined;
    const next = set(cur?.[key], index + 1);
    if (Array.isArray(current)) {
      const copy = [...current];
      copy[key as number] = next;
      return copy;
    }
    return { ...cur, [key]: next };
  }

  return set(obj, 0) as T;
}

// Parse paths like "props.children[0].props.children"
// into segments like ["props", "children", 0, "props", "children"]
function parsePath(path: string): (string | number)[] {
  return path
    .replace(/\[(\d+)]/g, '.$1') // [0] → .0
    .split('.')
    .filter(s => s !== '')
    .map(s => (/^\d+$/.test(s) ? Number(s) : s));
}
