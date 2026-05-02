import type { ReactNode } from 'react';
import type { ReactElementWithChildren } from 'react-cosmos-core';
import { setByPath } from 'react-cosmos-core';
import { isRootPath } from './elPath.js';
import { getExpectedElementAtPath } from './getElementAtPath.js';

export function setElementAtPath(
  node: ReactNode,
  elPath: string,
  updater: (el: ReactElementWithChildren) => ReactElementWithChildren
): ReactNode {
  const childEl = getExpectedElementAtPath(node, elPath);
  const newEl = updater(childEl);

  if (isRootPath(elPath)) {
    return newEl;
  }

  // If the root is a non-Array non-Element Node we should be at the root path
  // and returned already
  const root = node as ReactElementWithChildren | ReactNode[];
  return setByPath(root, elPath, newEl);
}
