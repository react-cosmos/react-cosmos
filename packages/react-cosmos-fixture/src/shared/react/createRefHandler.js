// @flow

import type { Ref, ElementRef } from 'react';

export function createRefHandler<T: any>(ref: Ref<T>) {
  return (elRef: ?ElementRef<T>) => {
    if (typeof ref === 'string') {
      // TODO: Log that string refs aren't supported. No need to throw exception,
      // though, because it would make Cosmos unusable for users of string refs.
      return;
    }

    // https://reactjs.org/docs/refs-and-the-dom.html#creating-refs
    if (typeof ref === 'function') {
      ref(elRef);
    } else if (ref && typeof ref === 'object') {
      ref.current = elRef;
    }
  };
}
