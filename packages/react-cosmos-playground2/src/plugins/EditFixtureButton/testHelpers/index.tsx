export async function mockFetch(
  httpStatus: number,
  cb: (fetchMock: jest.Mock) => Promise<unknown>
) {
  const w = window as any;
  const origFetch = window.fetch;
  w.fetch = jest.fn(async () => ({ status: httpStatus }));
  await cb(w.fetch);
  w.fetch = origFetch;
}
