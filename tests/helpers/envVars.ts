declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEST_EXAMPLE_NAME: 'webpack' | 'vite';
      TEST_LAZY: 'true' | 'false';
    }
  }
}

export function exampleName() {
  return process.env.TEST_EXAMPLE_NAME || 'vite';
}

export function lazy() {
  return process.env.TEST_LAZY === 'true';
}
