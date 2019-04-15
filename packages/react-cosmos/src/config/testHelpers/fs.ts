// @ts-ignore
export { __mockFile, __mockDir, __unmockFs } from '../fs';

jest.mock('../fs', () => {
  let fileMocks: { [path: string]: any } = {};
  let dirMocks: string[] = [];

  function requireFileAtPath(filePath: string) {
    return fileMocks[filePath];
  }

  function fileExistsAtPath(filePath: string) {
    return fileMocks.hasOwnProperty(filePath);
  }

  function dirExistsAtPath(dirPath: string) {
    return dirMocks.indexOf(dirPath) !== -1;
  }

  function __mockFile(filePath: string, fileMock: any) {
    fileMocks = { [filePath]: fileMock };
  }

  function __mockDir(dirPath: string) {
    dirMocks = [...dirMocks, dirPath];
  }

  function __unmockFs() {
    fileMocks = {};
    dirMocks = [];
  }

  return {
    requireFileAtPath,
    fileExistsAtPath,
    dirExistsAtPath,
    __mockFile,
    __mockDir,
    __unmockFs
  };
});
