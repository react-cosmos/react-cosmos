import * as React from 'react';
import { isEqual } from 'lodash';

// We need to do this because React doesn't provide a replaceState method
// (anymore) https://reactjs.org/docs/react-component.html#setstate
export function replaceState(
  elRef: React.Component,
  nextState: {},
  cb?: () => unknown
) {
  const fullState = resetOriginalKeys(elRef.state, nextState);
  if (!isEqual(fullState, elRef.state)) {
    elRef.setState(fullState, cb);
  }
}

function resetOriginalKeys(original: {}, current: {}): {} {
  return Object.keys(original).reduce(
    (result: {}, key) =>
      Object.keys(result).indexOf(key) === -1
        ? { ...result, [key]: undefined }
        : result,
    current
  );
}
