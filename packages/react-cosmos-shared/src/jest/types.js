// @flow

export type JestMock = {
  calls: Array<Array<any>>
};

export function getMock(fn: any): JestMock {
  return fn.mock;
}
