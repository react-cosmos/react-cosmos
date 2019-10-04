import React from 'react';
import { get } from 'lodash';
import { isElement } from 'react-is';
import { isRootPath } from './shared';

// Why be silent about trying to fetch a node that isn't an element?
// Because users of this utility only care about elements. Whether the child
// node was removed or replaced by a different type of node (eg. string,
// array of elements, etc.) is irrelevant.
// NICETOHAVE: Assert child path validity
export function getElementAtPath(
  node: React.ReactNode,
  elPath: string
): null | React.ReactElement<any> {
  if (!isElement(node) && !Array.isArray(node)) {
    return null;
  }

  const rootNode = node as React.ReactElement<any> | React.ReactNode[];
  const childNode = isRootPath(elPath) ? rootNode : get(rootNode, elPath);

  if (!isElement(childNode)) {
    return null;
  }

  return childNode as React.ReactElement<any>;
}

export function getExpectedElementAtPath(
  node: React.ReactNode,
  elPath: string
): React.ReactElement<any> {
  const el = getElementAtPath(node, elPath);

  if (!el) {
    throw new Error(`Element not found at path: ${elPath}`);
  }

  return el;
}
