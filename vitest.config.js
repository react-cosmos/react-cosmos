import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // TODO: Try to disable this after migration from Jest to Vitest is complete
    globals: true,
    // TODO: Try happy-dom, and potentially try enabling a browser environment
    // on a per-test basis
    environment: 'jsdom',
    // Default value: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    include: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
  },
});
