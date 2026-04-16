export function getByPath<T = unknown>(obj: unknown, path: string): T {
  let cur = obj;
  for (const key of parsePath(path)) {
    if (cur === null || cur === undefined) return undefined as T;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur as T;
}

export function setByPath<T>(obj: T, path: string, value: unknown): T {
  return setDeep(obj, parsePath(path), value, 0) as T;
}

function setDeep(
  current: unknown,
  keys: (string | number)[],
  value: unknown,
  index: number
): unknown {
  if (index === keys.length) return value;

  const key = keys[index];
  const currentChild = (current as Record<string | number, unknown>)?.[key];
  const nextValue = setDeep(currentChild, keys, value, index + 1);

  if (Array.isArray(current)) {
    const copy = [...current];
    copy[key as number] = nextValue;
    return copy;
  }

  return { ...(current as object), [key]: nextValue };
}

// Parse paths like "props.children[0].props.children"
function parsePath(path: string): (string | number)[] {
  const segments: (string | number)[] = [];
  for (const part of path.split('.')) {
    const match = part.match(/^([^[]*)(.*)/);
    if (!match) continue;
    if (match[1]) segments.push(match[1]);
    const brackets = match[2].matchAll(/\[(\d+)]/g);
    for (const b of brackets) segments.push(Number(b[1]));
  }
  return segments;
}
