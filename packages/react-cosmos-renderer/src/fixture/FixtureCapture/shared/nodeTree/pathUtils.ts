export function getChildrenPath(elPath: string) {
  return isRootPath(elPath) ? 'props.children' : `${elPath}.props.children`;
}

export function isRootPath(elPath: string) {
  return elPath === '';
}

export function getByPath<T = unknown>(obj: unknown, path: string): T {
  let cur = obj;
  for (const key of parsePath(path)) {
    if (cur === null || cur === undefined) return undefined as T;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur as T;
}

export function setByPath<T>(obj: T, path: string, value: unknown): T {
  const keys = parsePath(path);
  let cur = obj as Record<string | number, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]] as Record<string | number, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
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
