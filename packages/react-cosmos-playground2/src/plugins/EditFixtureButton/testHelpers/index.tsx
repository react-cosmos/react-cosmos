export async function mockFetch(
  cb: (fetchMock: jest.Mock) => Promise<unknown>
) {
  const w = window as any;
  const origFetch = window.fetch;
  w.fetch = jest.fn();
  await cb(w.fetch);
  w.fetch = origFetch;
}
