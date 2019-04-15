const actualProcessCwd = process.cwd;

export function mockProcessCwd(currentDir: string) {
  process.cwd = () => currentDir;
}

export function unmockProcessCwd() {
  process.cwd = actualProcessCwd;
}
