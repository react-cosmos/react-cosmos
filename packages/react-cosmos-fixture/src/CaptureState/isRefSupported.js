// @flow

import { Component } from 'react';
import { ForwardRef } from 'react-is';

import type { ElementType } from 'react';

export function isRefSupported(elementType: ElementType): boolean {
  if (typeof elementType === 'string') {
    return false;
  }

  // $FlowFixMe
  const { $$typeof, prototype } = elementType;

  return (
    $$typeof === ForwardRef ||
    // Warning: Some functions don't have the .prototype property
    (prototype &&
      // ES6 Class
      // Warning: This will return false is the component is extending a
      // different copy of React than the one used by Cosmos. This is relevant
      // when running Cosmos from an external location instead of node_modules.
      (prototype instanceof Component ||
        // React.createClass
        prototype.getInitialState !== undefined) &&
      true)
  );
}
