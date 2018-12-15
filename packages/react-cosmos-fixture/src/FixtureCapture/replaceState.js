// @flow

import { Component } from 'react';
import { isEqual } from 'lodash';

import type { ElementRef } from 'react';

// We need to do this because React doesn't provide a replaceState method
// (anymore) https://reactjs.org/docs/react-component.html#setstate
export function replaceState(
  elRef: ElementRef<typeof Component>,
  nextState: Object,
  cb?: () => mixed
) {
  const fullState = resetOriginalKeys(elRef.state, nextState);

  if (!isEqual(fullState, elRef.state)) {
    elRef.setState(fullState, cb);
  }
}

function resetOriginalKeys(original, current): Object {
  const { keys } = Object;

  return keys(original).reduce(
    (result: Object, key) =>
      keys(result).indexOf(key) === -1
        ? { ...result, [key]: undefined }
        : result,
    current
  );
}
