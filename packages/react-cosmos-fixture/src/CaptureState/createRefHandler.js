// @flow

import type { Ref, ElementRef } from 'react';

// Create a (composable) handler for both function refs and refs created using
// React.createRef.
export function createRefHandler(ref: Ref<any>) {
  return (elRef: ?ElementRef<any>) => {
    if (typeof ref === 'string') {
      console.warn('[CaptureState] String refs are not supported');
      // No need to throw exception, because it would make Cosmos unusable for
      // users of string refs.
      return;
    }

    // https://reactjs.org/docs/refs-and-the-dom.html#creating-refs
    if (typeof ref === 'function') {
      ref(elRef);
    } else if (ref && typeof ref === 'object') {
      ref.current = elRef;
    }

    // Return element ref to make the ref handler composable
    return elRef;
  };
}
