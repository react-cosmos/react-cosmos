// @flow

import { findElementPaths, getExpectedElementAtPath } from './childrenTree';

import type { Children } from './childrenTree';

export function findRelevantElementPaths(children: Children): string[] {
  const elPaths = findElementPaths(children);

  return elPaths.filter(elPath => {
    const { type } = getExpectedElementAtPath(children, elPath);

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
