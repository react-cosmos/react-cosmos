// @flow

import { findElementPaths, getExpectedElementAtPath } from './nodeTree';

import type { Node } from 'react';

export function findRelevantElementPaths(node: Node): string[] {
  const elPaths = findElementPaths(node);

  return elPaths.filter(elPath => {
    const { type } = getExpectedElementAtPath(node, elPath);

    // TODO: Make this customizable
    if (type === 'string') {
      return isInterestingTag(type);
    }

    return type.cosmosCapture !== false && type.name !== 'StyledComponent';
  });
}

function isInterestingTag(tagName: string) {
  return tagName !== 'div' && tagName !== 'span';
}
