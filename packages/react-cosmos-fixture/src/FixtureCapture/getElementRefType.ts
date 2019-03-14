import * as React from 'react';

export function getElementRefType(elRef: React.Component) {
  // NOTE: This assumes ref is a Class instance, something React might
  // change in the future
  return elRef.constructor as React.ComponentClass<any>;
}
