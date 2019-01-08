// @flow

import { get } from 'lodash';
import { isElement } from 'react-is';
import { isRootPath } from './shared';

import type { Node, Element } from 'react';

// Why be silent about trying to fetch a node that isn't an element?
// Because users of this utility only care about elements. Whether the child
// node was removed or replaced by a different type of node (eg. string,
// array of elements, etc.) is irrelevant.
// NICETOHAVE: Assert child path validity
export function getElementAtPath(
  node: Node,
  elPath: string
): null | Element<any> {
  if (!isElement(node) && !Array.isArray(node)) {
    return null;
  }

  // $FlowFixMe Flow can't get cues from react-is package
  const rootNode: Element<any> | Node[] = node;
  const childNode = isRootPath(elPath) ? rootNode : get(rootNode, elPath);

  if (!isElement(childNode)) {
    return null;
  }

  // $FlowFixMe Flow can't get cues from react-is package
  const childEl: Element<any> = childNode;

  return childEl;
}

export function getExpectedElementAtPath(
  node: Node,
  elPath: string
): Element<any> {
  const el = getElementAtPath(node, elPath);

  if (!el) {
    throw new Error(`Element not found at path: ${elPath}`);
  }

  return el;
}
