export function viteWorkerId() {
  return parseInt(process.env.VITEST_WORKER_ID || '1', 10);
}
