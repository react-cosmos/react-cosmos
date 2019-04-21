type ConsoleMockApi = {
  expectLog: (msg: string) => void;
};

export async function mockConsole<R>(
  cb: (api: ConsoleMockApi) => Promise<R>
): Promise<R> {
  const origConsoleLog = console.log;
  console.log = jest.fn();

  const expectedLogs: string[] = [];
  const ret = await cb({
    expectLog: (msg: string) => expectedLogs.push(msg)
  });
  expectedLogs.forEach(msg => expect(console.log).toBeCalledWith(msg));

  console.log = origConsoleLog;
  return ret;
}
