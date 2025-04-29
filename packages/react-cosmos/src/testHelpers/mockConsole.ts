import { vi } from 'vitest';

type ConsoleMockApi = {
  expectLog: (msg: string) => void;
};

export async function mockConsole<R>(
  cb: (api: ConsoleMockApi) => Promise<R>
): Promise<R> {
  const expectedLogs: string[] = [];

  const origConsoleLog = console.log;
  console.log = vi.fn((...args: unknown[]) => {
    if (typeof args[0] !== 'string' || !expectedLogs.includes(args[0])) {
      origConsoleLog(...args);
    }
  });

  try {
    const cbReturn = await cb({
      expectLog: (msg: string) => expectedLogs.push(msg),
    });
    expectedLogs.forEach(msg => expect(console.log).toBeCalledWith(msg));
    return cbReturn;
  } catch (err) {
    throw err;
  } finally {
    console.log = origConsoleLog;
  }
}
