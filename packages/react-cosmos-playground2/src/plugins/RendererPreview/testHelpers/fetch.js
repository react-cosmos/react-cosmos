// @flow

export function fakeFetchResponseStatus(status: number) {
  global.fetch = jest.fn(() => Promise.resolve({ status }));
}
