export function parseUrlQuery<T extends {}>(query: string): T {
  return Object.fromEntries(new URLSearchParams(query)) as T;
}

export function stringifyUrlQuery(params: {}): string {
  return new URLSearchParams(params).toString();
}
