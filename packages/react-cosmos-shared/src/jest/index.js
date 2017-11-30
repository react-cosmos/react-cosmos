// @flow

import type { JestMock } from './types';

export function until(
  cb: () => boolean,
  failMsg: string,
  timeout: number = 300
): Promise<any> {
  const t1 = Date.now();

  return new Promise((resolve, reject) => {
    function loop() {
      if (cb()) {
        resolve();
      } else if (Date.now() - t1 < timeout) {
        setTimeout(loop);
      } else {
        reject(failMsg);
      }
    }

    // Kick it
    loop();
  });
}

export function getMock(fn: any): JestMock {
  return fn.mock;
}
