export function fakeFetchResponseStatus(status: number) {
  (window as any).fetch = jest.fn(() => Promise.resolve({ status }));
}
