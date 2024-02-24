export function exampleName() {
  return process.env.TEST_EXAMPLE_NAME as 'webpack' | 'vite';
}

export function lazy() {
  return process.env.TEST_LAZY as 'true' | 'false';
}
