export function mockProcessCwd(currentDir: string) {
  global.process.cwd = () => currentDir;
}
