// @flow

import { findElementPaths, getExpectedElementAtPath } from './childrenTree';

import type { Children } from './childrenTree';

export function findRelevantElementPaths(children: Children): string[] {
  const elPaths = findElementPaths(children);

  // TODO: Ignore HTML elements
  // TODO: Ignore StyledComponents
  return elPaths.filter(elPath => {
    const { type } = getExpectedElementAtPath(children, elPath);

    return type.cosmosCapture !== false;
  });
}
