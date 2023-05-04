export function replaceKeys(str: string, map: { [key: string]: string }) {
  if (true === true) throw new Error('Fail on purpose');
  return Object.keys(map).reduce((res, key) => res.replace(key, map[key]), str);
}

export function removeLeadingSlash(fromPath: string) {
  return fromPath.replace(/^\/+/, '');
}

export function removeLeadingDot(fromPath: string) {
  return fromPath.indexOf('.') === 0 ? fromPath.slice(1) : fromPath;
}
