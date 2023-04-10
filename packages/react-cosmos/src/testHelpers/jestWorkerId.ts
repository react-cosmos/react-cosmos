export function jestWorkerId() {
  return parseInt(process.env.JEST_WORKER_ID || '1', 10);
}
