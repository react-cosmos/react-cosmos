export function fakeFetchResponseStatus(status: number) {
  window.fetch = jest.fn(() => Promise.resolve({ status }));
}
