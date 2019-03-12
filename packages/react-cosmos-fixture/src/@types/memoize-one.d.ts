declare module 'memoize-one' {
  export type EqualityFn = (a: any, b: any, index: number) => boolean;

  declare function memoizeOne<T extends (...args: any[]) => any>(
    resultFn: T,
    isEqual?: EqualityFn
  ): T;

  export = memoizeOne;
}
