export function mapValues<T, R>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => R
): Record<string, R> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));
}
