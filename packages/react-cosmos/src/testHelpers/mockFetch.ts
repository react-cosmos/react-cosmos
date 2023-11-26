import { Mock, vi } from 'vitest';

export async function mockFetch(
  httpStatus: number,
  cb: (fetchMock: Mock) => Promise<unknown>
) {
  const w = window as any;
  const origFetch = window.fetch;
  w.fetch = vi.fn(async () => ({ status: httpStatus }));
  await cb(w.fetch);
  w.fetch = origFetch;
}
