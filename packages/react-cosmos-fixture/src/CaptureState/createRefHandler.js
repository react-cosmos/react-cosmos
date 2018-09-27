// @flow

import type { Ref, ElementRef } from 'react';

// Create a (composable) handler for both function refs and refs created using
// React.createRef.
export function createRefHandler(ref: Ref<any>) {
  if (typeof ref === 'string') {
    // No need to throw exception, because it would make Cosmos unusable for
    // users of string refs.
    console.warn('[createRefHandler] String refs are not supported');
  }

  return (elRef: ?ElementRef<any>) => {
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
