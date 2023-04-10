type ConsoleMockApi = {
  expectLog: (msg: string) => void;
};

export async function mockConsole<R>(
  cb: (api: ConsoleMockApi) => Promise<R>
): Promise<R> {
  const expectedLogs: string[] = [];

  const origConsoleLog = console.log;
  console.log = jest.fn((...args: unknown[]) => {
    if (typeof args[0] !== 'string' || !expectedLogs.includes(args[0])) {
      origConsoleLog(...args);
    }
  });

  const cbReturn = await cb({
    expectLog: (msg: string) => expectedLogs.push(msg),
  });
  expectedLogs.forEach(msg => expect(console.log).toBeCalledWith(msg));

  console.log = origConsoleLog;

  return cbReturn;
}
