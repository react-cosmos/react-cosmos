export function exampleName() {
  return process.env.CYPRESS_EXAMPLE_NAME as 'webpack' | 'vite';
}

export function lazy() {
  return process.env.CYPRESS_LAZY as 'true' | 'false';
}
