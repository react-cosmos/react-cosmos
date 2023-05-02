import until from 'async-until';

export type RetryOpts = {
  timeout?: number;
  loopDelay?: number;
};

export async function retry(cb: () => unknown, opts: RetryOpts = {}) {
  const { timeout = 1000, loopDelay = 50 } = opts;
  const untilOpts = { ...opts, timeout, loopDelay };

  try {
    await until(async () => {
      try {
        await cb();
        return true;
      } catch (err) {
        return false;
      }
    }, untilOpts);
  } catch (err) {
    // At this point we know the condition failed, but we want to let the
    // original exception bubble up
    await cb();
  }
}
