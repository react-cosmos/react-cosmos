import React from 'react';
import { isElement } from 'react-is';

export function isReactElement(
  node: React.ReactNode
): node is React.ReactElement<any> {
  return isElement(node);
}
