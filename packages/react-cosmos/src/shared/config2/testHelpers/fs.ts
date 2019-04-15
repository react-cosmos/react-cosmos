// @ts-ignore
export { __mockFile, __unmockFs } from '../fs';

jest.mock('../fs', () => {
  let fileMocks: { [path: string]: any } = {};

  function requireFileAtPath(filePath: string) {
    return fileMocks[filePath];
  }

  function fileExistsAtPath(filePath: string) {
    return fileMocks.hasOwnProperty(filePath);
  }

  function __mockFile(filePath: string, fileMock: any) {
    fileMocks = { [filePath]: fileMock };
  }

  function __unmockFs() {
    fileMocks = {};
  }

  return {
    requireFileAtPath,
    fileExistsAtPath,
    __mockFile,
    __unmockFs
  };
});
