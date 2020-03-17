export type PlatformType = 'web' | 'native';

export function replaceKeys(str: string, map: { [key: string]: string }) {
  return Object.keys(map).reduce((res, key) => res.replace(key, map[key]), str);
}

export function removeLeadingSlash(fromPath: string) {
  return fromPath.replace(/^\/+/, '');
}

export function removeLeadingDot(fromPath: string) {
  return fromPath.indexOf('.') === 0 ? fromPath.slice(1) : fromPath;
}

export function asyncify<T extends (args: any) => any>(fn: T) {
  return async (args: Parameters<T>[0]): Promise<ReturnType<T>> => {
    const result = fn(args);
    return Promise.resolve(result);
  };
}
